import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
    private readonly privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgEZ6n1tEjSq8MnpXX4mvbCe7slTzt97/xK9i5A9F4XMYt7GXO15n
lKoSS+pU3RzDW9nBh4CKKYBHdpzgN4lAcW0NU9uFHclk9vB3VZgiNcwdihQj+bJJ
Mv1C9Nsggpwe/7+54ywH4CR+tU2wsSG3ufe/Vwk58Y1LWKPnsui0Fw0NAgMBAAEC
gYAags2muyaOyLQEKRGa7Q219HikU/j6PSNzBbPbuuGPNeEDQGvomvXk83Ty9HEn
/KR0SMP7qfzqb/dCE2VQj5kakzE9IYBSqhYS9vOf8Qzv5ltUuyHq3fFcEUcHtsEL
f3XY8e+cdps54bsUNvqvQuqPCxobymEXjmZR9fMt04dHUQJBAIk13+1tENr0jV5S
QZU3GlT5gxB6FGGZzZtJW94ptm8OZnHcZdxd1tmYfNYy9oj6Z2uVU5aVYq0zqNDb
2mwPoYMCQQCDfvidaFFqjqaWLqyHIP7C1yZMIQ4Z0NOUMqbzf/YW8Y1fXXshAMg2
3DQmZQPJqruXviYTtjODIAi2AK3tFyIvAkBqfzFeBABIIfYz1l5m5Yz/lWY//LEj
DBCEzcyLRA8AZcnn6Cv7fa5L18pVKtsleE2bOBzXzPz4+Ba4fVwr8XnnAkAFatm7
Qmz4QuBCF7Ir7wQP6uU9Ba+bCKtu05dlOMRetZzpbOSBu5KEEBZl7ot1Z39LBR50
eXEt2cgCF40S030pAkAoOxhXVdfSLQh1xwtp+r3yPI8kOa06akbl+Yinr8+51IXD
gxNOngW5bGzx1C2eJMcDl597rUxNcyH5Ck+r5+7l
-----END RSA PRIVATE KEY-----`;

    private readonly publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEZ6n1tEjSq8MnpXX4mvbCe7slTz
t97/xK9i5A9F4XMYt7GXO15nlKoSS+pU3RzDW9nBh4CKKYBHdpzgN4lAcW0NU9uF
Hclk9vB3VZgiNcwdihQj+bJJMv1C9Nsggpwe/7+54ywH4CR+tU2wsSG3ufe/Vwk5
8Y1LWKPnsui0Fw0NAgMBAAE=
-----END PUBLIC KEY-----`;

    generateAesKey(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    encryptAes(payload: string, aesKey: string): string {
        const iv = crypto.randomBytes(16);
        const key = Buffer.from(aesKey, 'hex');
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(payload, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    decryptAes(encryptedData: string, aesKey: string): string {
        const parts = encryptedData.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted data format. Expected IV:Ciphertext');
        }
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        const key = Buffer.from(aesKey, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    encryptRsaPrivate(data: string): string {
        const buffer = Buffer.from(data, 'utf8');
        const encrypted = crypto.privateEncrypt(this.privateKey, buffer);
        return encrypted.toString('base64');
    }

    decryptRsaPublic(encryptedData: string): string {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.publicDecrypt(this.publicKey, buffer);
        return decrypted.toString('utf8');
    }

    async getEncryptData(payload: string) {
        try {
            // 2. Create AES key
            const aesKey = this.generateAesKey(); // 32 bytes hex string (64 chars)

            // 3. Encrypt payload with AES key
            const data2 = this.encryptAes(payload, aesKey);

            // 4. Encrypt AES key with private key -> data1
            const data1 = this.encryptRsaPrivate(aesKey);

            return {
                successful: true,
                error_code: "",
                data: {
                    data1,
                    data2,
                },
            };
        } catch (e) {
            return {
                successful: false,
                error_code: e.message,
                data: null,
            };
        }
    }

    async getDecryptData(data1: string, data2: string) {
        try {
            // 2. Get AES Key, Decrypt data1 with public key
            const aesKey = this.decryptRsaPublic(data1);

            // 3. Decrypt data2 with AES key
            const payload = this.decryptAes(data2, aesKey);

            return {
                successful: true,
                error_code: "",
                data: {
                    payload,
                },
            };
        } catch (e) {
            return {
                successful: false,
                error_code: e.message || 'Decryption failed',
                data: null,
            };
        }
    }
}
