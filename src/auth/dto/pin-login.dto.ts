import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PinLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ci: string;

  @ApiProperty()
  @IsString()
  pin: string;
}
