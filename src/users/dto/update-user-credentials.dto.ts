import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserCredentialsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pin?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;
}
