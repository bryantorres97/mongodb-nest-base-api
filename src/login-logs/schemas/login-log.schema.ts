import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LoginLogDocument = HydratedDocument<LoginLog>;

@Schema({ timestamps: true })
export class LoginLog {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  blockStatus: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Boolean, required: true })
  isCorrect: boolean;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);

export const LoginLogModelName = 'loginLogs';
