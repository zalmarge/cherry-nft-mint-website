import { DiskType, ItemType } from '@/types';
import { getToken } from '@/utils/getToken';
import { NextResponse } from 'next/server';

export async function GET() {

  const productData = await fetch(
    `${process.env.NEXT_CHERRY_SERVER_URI}/v1.0/products`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  const tdata = await productData.text();
  console.log(tdata);
  const truncated = tdata.split("false}]}}]")[0] + "false}]}}]";
  const data = JSON.parse(truncated);
  // const data = await productData.json();

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