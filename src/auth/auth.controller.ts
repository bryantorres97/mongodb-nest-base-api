import { Controller, Logger, UseGuards, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication, GetUser } from './decorators';
import { LoginDto } from './dto';
import { LocalAuthGuard } from './guards';
// import { LocalAuthGuard } from './guards/';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @GetUser() user: UserDocument) {
    this.logger.log('Logging in user ' + loginDto.username);
    const userData = this.authService.login(user);
    return userData;
  }

  @Authentication()
  @Get('renew')
  async renewToken(@GetUser() user: UserDocument) {
    this.logger.log('Renewing token for user ' + user.name);
    const userData = this.authService.login(user);
    return userData;
  }
}
