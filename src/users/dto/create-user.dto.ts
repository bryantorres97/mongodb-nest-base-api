import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class QuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  answer: string;
}
export class CreateUserDto {
  @ApiProperty({ type: QuestionDto, isArray: true })
  @IsArray()
  questions: QuestionDto[];

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  ci: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  faceId: boolean;

  @ApiProperty()
  @IsString()
  dactilarCode: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  pin: string;
}
