import { ConfigType } from '@/app/mint/page';
import { DiskType, ItemType } from '@/types';
import { getToken } from '@/utils/getToken';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function POST(request: Request) {
  const data = await request.json();
  const product: ConfigType = data.product;
  const wallet = data.wallet;
  // Fetch data from external API
//   return NextResponse.json({ data:"test" });
const ram = product.ramOptions[0].name;
const osDisk = product.osDiskOptions.map((option => option.name));
const dataDisk = product.dataDiskOptions.map((option => option.name));
const body = {
    product: product.uuid,
    email: data.email,
    public_key: data.publicKey,
    "ram": ram,
    "disks": osDisk.concat(dataDisk),
}

  const productData = await fetch(
    `${process.env.NEXT_CHERRY_SERVER_URI}/v1.0/orders`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        "Content-Type": "application/json",
      },

      method: "POST",
      body: JSON.stringify(body),
    }
  );
  const response: any = await productData.json();
setTimeout(async () => {
    const tokenData = await fetch(
      `${process.env.NEXT_CHERRY_SERVER_URI}/v1.0/tokens/${data.publicKey}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },

        method: "PUT",
        body: JSON.stringify({
          "wallet": wallet,
          "action": "mint",
        }),
      }
    );
    const tokenResponse: any = await tokenData.json();
  }, 2000);
  return NextResponse.json({ response });
}

