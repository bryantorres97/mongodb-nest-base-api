import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpModelName, OtpSchema } from './entities/otp.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OtpModelName, schema: OtpSchema }]),
  ],
  controllers: [OtpsController],
  providers: [OtpsService],
})
export class OtpsModule {}
