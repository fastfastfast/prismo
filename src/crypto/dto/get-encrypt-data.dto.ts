import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEncryptDataDto {
    @ApiProperty({
        description: 'Payload to encrypt',
        minLength: 0,
        maxLength: 2000,
    })
    @IsString()
    @IsNotEmpty()
    @Length(0, 2000)
    payload: string;
}
