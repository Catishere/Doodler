import * as crypto from 'crypto';

class CryptoUtils {
  algorithm: string;
  key: Buffer;
  iv: Buffer;

  constructor() {
    this.algorithm = 'aes-128-cbc';
    this.key = crypto.randomBytes(16);
    this.iv = crypto.randomBytes(16);
  }

  public encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      this.iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  public decrypt(text: string): string {
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      this.iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
export const cryptoUtils = new CryptoUtils();
