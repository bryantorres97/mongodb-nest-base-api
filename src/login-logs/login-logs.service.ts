import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginLogModelName } from './schemas/login-log.schema';
import { LoginLogDocument } from '../login-logs/schemas/login-log.schema';
import { CreateLoginLogDto } from './dto';

@Injectable()
export class LoginLogsService {
  logger = new Logger(LoginLogsService.name);

  constructor(
    @InjectModel(LoginLogModelName)
    private readonly loginLogModel: Model<LoginLogDocument>,
  ) {}

  async createLoginLog(createLoginLogDto: CreateLoginLogDto) {
    this.logger.log('Creating login log');
    return await this.loginLogModel.create(createLoginLogDto);
  }

  async countBadLoginLogs(username: string, lastLogin: Date) {
    this.logger.log('Counting bad login logs');
    return await this.loginLogModel.countDocuments({
      username,
      isCorrect: false,
      createdAt: { $gte: lastLogin },
    });
  }
}
