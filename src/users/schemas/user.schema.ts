import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

// @Schema({ _id: false })
class Question {
  // @Prop({ type: String, required: true })
  question: string;
  // @Prop({ type: String, required: true })
  answer: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Date, required: true, default: Date.now })
  lastPasswordUpdated: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  lastPinUpdated: Date;

  @Prop({ type: String, required: true, default: 'FALSE' })
  blockStatus: string;

  @Prop({ type: Boolean, required: true, default: false })
  isAdmin: boolean;

  @Prop({
    type: [{ _id: false, question: String, answer: String }],
    default: [],
  })
  questions: Question[];

  @Prop({ type: String, required: true })
  ci: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: Boolean, required: true, default: false })
  faceId: boolean;

  @Prop({ type: String, required: true, default: '' })
  dactilarCode: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, default: '' })
  pin: string;

  @Prop({ type: String, default: '' })
  photo: string;

  @Prop({ type: Date, required: true, default: Date.now })
  lastLogin: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  comparePin(pin: string): Promise<boolean> {
    return bcrypt.compare(pin, this.pin);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    this.lastPasswordUpdated = new Date();
  }

  if (this.isModified('pin')) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.pin, salt);
    this.pin = hash;
    this.lastPinUpdated = new Date();
  }

  next();
});

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.comparePin = async function (pin: string): Promise<boolean> {
  return await bcrypt.compare(pin, this.pin);
};

UserSchema.method('toJSON', function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, password, pin, ...object } = this.toObject();
  return object;
});

export const UserModelName = 'users';
