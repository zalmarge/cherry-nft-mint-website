import { DiskType, ItemType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch data from external API
  const tokenData = await fetch(
    "http://cherry-nft.cloud.cherryservers.net/v1.0/tokens",
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    }
  );
  const tokendata = await tokenData.json();
  console.log(tokendata);
  const productData = await fetch(
    "http://cherry-nft.cloud.cherryservers.net/v1.0/products",
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    }
  );
  const tdata = await productData.text();
  const truncated = tdata.split("false}]}}]")[0] + "false}]}}]";
  const data = JSON.parse(truncated);

  const newData = data.map((product: ItemType) => {
    return {
      ...product,
      numOS: product.disks.reduce(
        (acc: number, disk: DiskType) => acc + (disk === "os" ? 1 : 0),
        0
      ),
      numData: product.disks.reduce(
        (acc: number, disk: DiskType) => acc + (disk === "data" ? 1 : 0),
        0
      ),
    };
  });
  return NextResponse.json({ productData: newData });
}