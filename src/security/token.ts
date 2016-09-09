import * as crypto from 'crypto';
import * as base64url from "base64-url";

export class TokenHelper {
    static HMACSha256(buf: Buffer | string, key: string): Buffer {
        return crypto.createHmac('sha256', key).update(buf).digest();
    } 

    static generateToken(data: string, key: string): string {
        const hmac = this.HMACSha256(data, key);
        const buf = Buffer.from(data);
        
        return base64url.encode(Buffer.concat([hmac, buf]));        
    }

    static extractToken(token: string, key: string): string {
        const buf = Buffer.from(base64url.unescape(token), 'base64');

        if (buf.byteLength < 33) {
            return null;
        }

        const signature = buf.slice(0, 32)
        const data = buf.slice(32)        

        if (Buffer.compare(signature, this.HMACSha256(data, key))  != 0) {
            return null;
        }

        return data.toString('utf8');
    }
}
