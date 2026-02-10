import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
    let service: CryptoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptoService],
        }).compile();

        service = module.get<CryptoService>(CryptoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should encrypt and decrypt payload successfully', async () => {
        const payload = 'test-payload-123';

        // Encrypt
        const encrypted = await service.getEncryptData(payload);
        expect(encrypted.successful).toBe(true);
        expect(encrypted.data).toBeDefined();
        expect(encrypted.data.data1).toBeDefined();
        expect(encrypted.data.data2).toBeDefined();

        // Decrypt
        const decrypted = await service.getDecryptData(encrypted.data.data1, encrypted.data.data2);
        expect(decrypted.successful).toBe(true);
        expect(decrypted.data.payload).toBe(payload);
    });

    it('should fail with invalid data', async () => {
        const decrypted = await service.getDecryptData('invalid', 'invalid');
        expect(decrypted.successful).toBe(false);
        expect(decrypted.data).toBeNull();
    });
});
