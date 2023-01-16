import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OtpDocument, OtpModelName } from './entities/otp.entity';
import { Model } from 'mongoose';
import { addMinutes } from 'date-fns';

@Injectable()
export class OtpsService {
  constructor(
    @InjectModel(OtpModelName) private otpsModel: Model<OtpDocument>,
  ) {}
  async create(createOtpDto: CreateOtpDto) {
    return await this.otpsModel.create(createOtpDto);
  }

  async verify(otp: string) {
    // TODO - Cambiar parametrizacion a variable de entorno
    const startDate = addMinutes(new Date(), -5);
    const otpData = await this.otpsModel.findOne({
      otp,
      verified: false,
      expiresAt: { $gte: startDate },
      isActive: true,
    });
    if (!otpData) return null;
    const updatedOtp = await this.otpsModel.findOneAndUpdate(
      { _id: otpData._id },
      { verified: true },
      { new: true },
    );
    return updatedOtp;
  }

  findAll() {
    return `This action returns all otps`;
  }

  findOne(id: string) {
    return `This action returns a #${id} otp`;
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
