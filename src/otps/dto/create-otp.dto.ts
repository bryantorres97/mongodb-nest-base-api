import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateOtpDto {
  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsDate()
  expiresAt: Date;
}
