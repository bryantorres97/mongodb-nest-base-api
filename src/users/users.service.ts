import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, UserModelName } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findAll() {
    return await this.userModel.find({ isActive: true });
  }

  async findOne(user: { _id?: string; username?: string }) {
    return await this.userModel.findOne({ ...user, isActive: true });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate(
      { _id, isActive: true },
      { ...updateUserDto },
      { new: true },
    );
  }

  async remove(_id: string) {
    return await this.userModel.findOneAndUpdate(
      { _id, isActive: true },
      { isActive: false },
      { new: true },
    );
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username, isActive: true });
    if (user && (await user.comparePassword(password))) return user;
    return null;
  }
}
