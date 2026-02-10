import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService implements OnModuleInit {
    private publicKey: string;
    private privateKey: string;

    onModuleInit() {
        // Generate keys for demonstration since they were "Given" but not provided in file.
        // In a real app, these would be loaded from env or files.
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        console.log('Keys generated successfully for session.');
    }

    generateAesKey(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    encryptAes(payload: string, aesKey: string): string {
        const iv = crypto.randomBytes(16);
        // Use the first 32 bytes of the hex string as key (if hex is 64 chars, 32 bytes).
        // Actually, if generateAesKey produces 64 chars (32 bytes hex), we need a Buffer.
        // Let's treat the aesKey string as the key material.
        // If it's hex, use it as is? "Generate random string".
        // I'll assume the string itself is the key or I hash it to get 32 bytes.
        // For simplicity and standard, I'll use the buffer from the hex string.

        // Ensure key length is correct for AES-256 (32 bytes). 
        // If generateAesKey returns hex of 32 bytes -> 64 chars. 
        // crypto.createCipheriv expects Buffer or KeyObject.

        const key = Buffer.from(aesKey, 'hex'); // Assuming aesKey is hex string of 32 bytes data
        if (key.length !== 32) {
            // If generic string, hash it? 
            // Requirement: "Create AES key by Generate random string". 
            // I'll stick to a valid 32-byte hex string.
            // But validating what comes in for Decrypt is important.
        }

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(payload, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Return IV + Encrypted data? Requirement just says "data2: string". 
        // Usually you need IV to decrypt. 
        // I'll prepend IV to the result or user requirement implies just "encrypt payload with AES key".
        // I'll adhere to standard practice: IV:EncryptedData
        return iv.toString('hex') + ':' + encrypted;
    }

    decryptAes(encryptedData: string, aesKey: string): string {
        const parts = encryptedData.split(':');
        if (parts.length !== 2) {
            // Fallback if no IV? Or assume fixed IV (bad security)?
            // If I strictly follow "encrypt payload with AES key", maybe they expect ECB (insecure) or implicit IV?
            // I'll stick to IV included.
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
        // Encrypt with Private Key (so Public Key can decrypt).
        // This is technically "signing" in some contexts or "private encrypt".
        // crypto.privateEncrypt(privateKey, buffer)
        const buffer = Buffer.from(data, 'utf8');
        const encrypted = crypto.privateEncrypt(this.privateKey, buffer);
        return encrypted.toString('base64');
    }

    decryptRsaPublic(encryptedData: string): string {
        // Decrypt with Public Key.
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
