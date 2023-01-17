import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BiometricLoginDto, LoginDto } from '../auth/dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserCredentialsDto } from './dto/update-user-credentials.dto';
import { UserDocument, UserModelName } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, ci } = createUserDto;
    const existsUserByUsername = await this.userModel.findOne({
      username,
      isActive: true,
    });

    if (existsUserByUsername)
      throw new BadRequestException(
        `El nombre de usuario ${username} ya existe`,
      );

    const existsUserByCi = await this.userModel.findOne({ ci, isActive: true });

    if (existsUserByCi)
      throw new BadRequestException(
        `El usuario con número de cédula ${ci} ya se encuentra registrado`,
      );

    return await this.userModel.create(createUserDto);
  }

  async findAll() {
    return await this.userModel.find({ isActive: true }, { __v: 0 });
  }

  async findOne(user: { _id?: string; username?: string; ci?: string }) {
    return await this.userModel.findOne({ ...user, isActive: true });
  }

  async updateCredentials(
    _id: Types.ObjectId,
    updateUserDto: UpdateUserCredentialsDto,
  ) {
    const user = await this.userModel.findOne({ _id, isActive: true });
    if (!user) return null;

    if (updateUserDto.password) user.password = updateUserDto.password;

    if (updateUserDto.pin) user.pin = updateUserDto.pin;

    if (user.blockStatus !== 'FALSE') {
      user.blockStatus = 'FALSE';
      user.lastLogin = new Date();
    }

    return await user.save();
  }

  async unblockUser(_id: Types.ObjectId) {
    return await this.userModel.findOneAndUpdate(
      { _id, isActive: true },
      {
        blockStatus: 'FALSE',
      },
      { new: true },
    );
  }

  async blockUser(_id: Types.ObjectId) {
    return await this.userModel.findOneAndUpdate(
      { _id, isActive: true },
      {
        blockStatus: 'BLOCKED',
      },
      { new: true },
    );
  }

  async updateLastLogin(_id: Types.ObjectId) {
    return await this.userModel.findOneAndUpdate(
      { _id, isActive: true },
      {
        lastLogin: new Date(),
      },
    );
  }

  async remove(_id: string) {
    return await this.userModel.findOneAndUpdate(
      { _id, isActive: true },
      { isActive: false },
      { new: true },
    );
  }

  async validateUser(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username, isActive: true });
    if (user && (await user.comparePassword(password))) return user;
    return null;
  }

  async validateUserPin(loginDto: { ci: string; pin: string }) {
    const { ci, pin } = loginDto;
    const user = await this.userModel.findOne({ ci, isActive: true });
    if (user && (await user.comparePin(pin))) return user;
    return null;
  }

  async validateUserBiometric(loginDto: BiometricLoginDto) {
    const { ci } = loginDto;
    const user = await this.userModel.findOne({
      ci,
      isActive: true,
      faceId: true,
    });

    if (user) return user;

    return null;
  }
}
