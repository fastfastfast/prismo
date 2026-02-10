import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDecryptDataDto {
    @ApiProperty({ description: 'Encrypted AES key (data1)' })
    @IsString()
    @IsNotEmpty()
    data1: string;

    @ApiProperty({ description: 'Encrypted payload (data2)' })
    @IsString()
    @IsNotEmpty()
    data2: string;
}
