import * as crypto from 'crypto';

interface Payload {
    exp: number;
    pub_key_id: string;
}


function decryptPrivateKey(encryptedKey: string, password: string): string {
    const privateKey = crypto.createPrivateKey({
        key: encryptedKey,
        format: 'pem',
        passphrase: password
    });
    return privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
}
export function getToken(): string {
    const payload: Payload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        pub_key_id: process.env.NEXT_PUBLIC_PUBKEY_ID
    };

    const header = {
        typ: 'JWT',
        alg: 'RS256'
    };

    const privateKey = decryptPrivateKey(process.env.NEXT_PRIVATE_KEY, process.env.NEXT_PRIVATE_KEY_PASSPHRASE);

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    const data = `${headerEncoded}.${payloadEncoded}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    const signature = sign.sign(privateKey, 'base64');
    console.log(signature)
    const token = `${data}.${signature}`;
    console.log(token);
    return token;
}

function base64UrlEncode(text: string): string {
    return Buffer.from(text)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
