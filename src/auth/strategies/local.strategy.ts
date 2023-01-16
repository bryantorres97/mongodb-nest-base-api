import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/users.service';
import { LoginLogsService } from '../../login-logs/login-logs.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(LocalStrategy.name);

  constructor(
    private usersService: UsersService,
    private loginLogsService: LoginLogsService,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, username: string, password: string) {
    const ipAddresses =
      req.header('x-forwarded-for') || req.socket.remoteAddress;
    this.logger.debug('IP Address: ' + ipAddresses);

    const userByUsername = await this.usersService.findOne({ username });

    if (userByUsername && userByUsername.blockStatus !== 'FALSE') {
      await this.loginLogsService.createLoginLog({
        ip: ipAddresses,
        username,
        blockStatus: userByUsername.blockStatus,
        isCorrect: false,
      });
      throw new ForbiddenException('Usuario bloqueado');
    }
    const user = await this.usersService.validateUser({ username, password });
    if (!user) {
      await this.loginLogsService.createLoginLog({
        ip: ipAddresses,
        username,
        blockStatus: userByUsername.blockStatus,
        isCorrect: false,
      });

      const incorrectLogins = await this.loginLogsService.countBadLoginLogs(
        username,
        userByUsername.lastLogin,
      );

      // TODO - Leer cantidad de intentos desde variable de entorno o base de datos
      if (incorrectLogins >= 3) {
        this.logger.debug('Incorrect logins: ' + incorrectLogins);
        await this.usersService.blockUser(userByUsername._id);
      }
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    await this.loginLogsService.createLoginLog({
      ip: ipAddresses,
      username,
      blockStatus: userByUsername.blockStatus,
      isCorrect: true,
    });

    await this.usersService.updateLastLogin(user._id);
    return user;
  }
}
