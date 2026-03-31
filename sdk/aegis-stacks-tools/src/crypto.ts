import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const ALG = 'aes-256-cbc';

function key(password: string, salt: Buffer): Buffer {
    return scryptSync(password, salt, 32) as Buffer;
}

export function encrypt(plaintext: string, password: string): string {
    const salt = randomBytes(16);
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALG, key(password, salt), iv);
    const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    return [salt, iv, enc].map(b => b.toString('hex')).join(':');
}

export function decrypt(ciphertext: string, password: string): string {
    const [saltHex, ivHex, encHex] = ciphertext.split(':');
    const decipher = createDecipheriv(
        ALG,
        key(password, Buffer.from(saltHex, 'hex')),
        Buffer.from(ivHex, 'hex')
    );
    return Buffer.concat([
        decipher.update(Buffer.from(encHex, 'hex')),
        decipher.final(),
    ]).toString('utf8');
}
