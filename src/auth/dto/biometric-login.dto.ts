import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BiometricLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ci: string;
}
