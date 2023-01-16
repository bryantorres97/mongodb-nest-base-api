import { ApiProperty } from '@nestjs/swagger';

export class ICreateUserResponse {
  @ApiProperty()
  blockStatus: string;
  @ApiProperty()
  isAdmin: boolean;
  @ApiProperty({ isArray: true, type: () => IQuestion })
  questions: IQuestion[];
  @ApiProperty()
  ci: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  faceId: boolean;
  @ApiProperty()
  dactilarCode: string;
  @ApiProperty()
  pin: string;
  @ApiProperty()
  photo: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  _id: string;
  @ApiProperty()
  lastPasswordUpdated: Date;
  @ApiProperty()
  lastPinUpdated: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class IQuestion {
  @ApiProperty()
  question: string;
  @ApiProperty()
  answer: string;
}
