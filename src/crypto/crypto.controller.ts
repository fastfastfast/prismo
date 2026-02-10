import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { GetEncryptDataDto } from './dto/get-encrypt-data.dto';
import { GetDecryptDataDto } from './dto/get-decrypt-data.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Encryption')
@Controller()
export class CryptoController {
    constructor(private readonly cryptoService: CryptoService) { }

    @Post('get-encrypt-data')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Encryption successful' })
    async getEncryptData(@Body() dto: GetEncryptDataDto) {
        return this.cryptoService.getEncryptData(dto.payload);
    }

    @Post('get-decrypt-data')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Decryption successful' })
    async getDecryptData(@Body() dto: GetDecryptDataDto) {
        return this.cryptoService.getDecryptData(dto.data1, dto.data2);
    }
}
