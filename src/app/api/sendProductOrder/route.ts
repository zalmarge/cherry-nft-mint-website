import { ConfigType } from '@/app/mint/page';
import { DiskType, ItemType } from '@/types';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function POST(request: Request) {
  const data = await request.json();
  const product: ConfigType = data.product;
  const wallet = data.wallet;
  console.log("product", product);
  // Fetch data from external API
//   return NextResponse.json({ data:"test" });
const ram = product.ramOptions[0].name;
console.log("pk", data.publicKey)
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
    "http://cherry-nft.cloud.cherryservers.net/v1.0/orders",
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
      `http://cherry-nft.cloud.cherryservers.net/v1.0/tokens/${data.publicKey}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
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
    console.log("token response", tokenResponse);
  }, 2000);
  return NextResponse.json({ response });
}

