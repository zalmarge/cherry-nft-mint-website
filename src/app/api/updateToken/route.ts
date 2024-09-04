
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const data = await request.json();
  const wallet = data.wallet;
  const action = data.action;

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
          "action": action,
        }),
      }
    );
    const response: any = await tokenData.json();
    console.log("token response", response);
  return NextResponse.json({ response });
}

