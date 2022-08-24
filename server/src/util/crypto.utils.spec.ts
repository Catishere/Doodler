import { cryptoUtils } from './crypto.utils';

describe('CryptoUtils', () => {
  describe('encrypt decrypt test', () => {
    it('Should generate correct keys', () => {
      const text = 'Test123';
      const encrypted = cryptoUtils.encrypt(text);
      const decrypted = cryptoUtils.decrypt(encrypted);
      expect(text).toBe(decrypted);
    });
  });
});
