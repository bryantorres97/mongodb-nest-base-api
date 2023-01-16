import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: Date, required: true, default: Date.now })
  expiresAt: Date;

  @Prop({ type: Boolean, required: true, default: false })
  verified: boolean;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

export const OtpModelName = 'otps';
