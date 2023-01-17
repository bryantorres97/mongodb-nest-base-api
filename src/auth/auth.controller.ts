import {
  Controller,
  Logger,
  UseGuards,
  Post,
  Body,
  Get,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication, GetUser } from './decorators';
import { BiometricLoginDto, LoginDto, PinLoginDto } from './dto';
import { LocalAuthGuard } from './guards';
// import { LocalAuthGuard } from './guards/';
import { UserDocument } from '../users/schemas/user.schema';
import { Param, Res } from '@nestjs/common/decorators';
import { CoacServicesService } from '../coac-services/coac-services.service';
import { Request, Response } from 'express';
import { NotFoundException } from '@nestjs/common/exceptions';
import { getError } from '../common/helpers/manage-errors.helper';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorData } from '../common/interfaces/error-data.interface';
import { LoginLogsService } from '../login-logs/login-logs.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly coacServices: CoacServicesService,
    private loginLogsService: LoginLogsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() loginDto: LoginDto,
    @GetUser() user: UserDocument,
  ) {
    this.logger.log('Logging in user ' + loginDto.username);

    const userData = this.authService.login(user);
    return userData;
  }

  @Post('pin-login')
  async pinLogin(@Req() req: Request, @Body() loginDto: PinLoginDto) {
    this.logger.log('Logging in user ' + loginDto.ci);

    const { ci } = loginDto;

    const ipAddresses =
      req.header('x-forwarded-for') || req.socket.remoteAddress;
    this.logger.debug('IP Address: ' + ipAddresses);

    const userByCi = await this.usersService.findOne({ ci });

    if (!userByCi) {
      this.logger.debug(`El usuario con cédula ${ci} no existe`);
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (userByCi && userByCi.blockStatus !== 'FALSE') {
      await this.loginLogsService.createLoginLog({
        ip: ipAddresses,
        username: userByCi.username,
        blockStatus: userByCi.blockStatus,
        isCorrect: false,
      });
      throw new ForbiddenException('Usuario bloqueado');
    }

    const user = await this.usersService.validateUserPin(loginDto);

    if (!user) {
      await this.loginLogsService.createLoginLog({
        ip: ipAddresses,
        username: loginDto.ci,
        blockStatus: userByCi.blockStatus,
        isCorrect: false,
      });

      const incorrectLogins = await this.loginLogsService.countBadLoginLogs(
        ci,
        userByCi.lastLogin,
      );

      // TODO - Leer cantidad de intentos desde variable de entorno o base de datos
      if (incorrectLogins >= 3) {
        this.logger.debug('Incorrect logins: ' + incorrectLogins);
        await this.usersService.blockUser(userByCi._id);
      }
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    await this.loginLogsService.createLoginLog({
      ip: ipAddresses,
      username: userByCi.username,
      blockStatus: userByCi.blockStatus,
      isCorrect: true,
    });

    await this.usersService.updateLastLogin(user._id);
    const userData = this.authService.login(user);
    return userData;
  }

  @Post('biometric-login')
  async create(@Req() req: Request, @Body() data: BiometricLoginDto) {
    this.logger.log('Logging in user ' + data.ci);

    const { ci } = data;

    const ipAddresses =
      req.header('x-forwarded-for') || req.socket.remoteAddress;
    this.logger.debug('IP Address: ' + ipAddresses);

    const userByCi = await this.usersService.findOne({ ci });

    if (!userByCi) {
      this.logger.debug(`El usuario con cédula ${ci} no existe`);
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (userByCi && userByCi.blockStatus !== 'FALSE') {
      await this.loginLogsService.createLoginLog({
        ip: ipAddresses,
        username: userByCi.username,
        blockStatus: userByCi.blockStatus,
        isCorrect: false,
      });
      throw new ForbiddenException('Usuario bloqueado');
    }

    if (!userByCi.faceId) {
      this.logger.debug(`El usuario con cédula ${ci} no tiene huella digital`);
      throw new UnauthorizedException('Usuario no tiene huella digital');
    }

    // const user = await this.usersService.validateUserBiometric(data);

    // if (!user) {
    //   await this.loginLogsService.createLoginLog({
    //     ip: ipAddresses,
    //     username: ci,
    //     blockStatus: userByCi.blockStatus,
    //     isCorrect: false,
    //   });

    //   const incorrectLogins = await this.loginLogsService.countBadLoginLogs(
    //     ci,
    //     userByCi.lastLogin,
    //   );

    //   // TODO - Leer cantidad de intentos desde variable de entorno o base de datos
    //   if (incorrectLogins >= 3) {
    //     this.logger.debug('Incorrect logins: ' + incorrectLogins);
    //     await this.usersService.blockUser(userByCi._id);
    //   }
    //   this.logger.debug('Incorrect logins: ' + incorrectLogins);
    //   throw new UnauthorizedException('Usuario o contraseña incorrectos');
    // }

    await this.loginLogsService.createLoginLog({
      ip: ipAddresses,
      username: userByCi.username,
      blockStatus: userByCi.blockStatus,
      isCorrect: true,
    });
    this.logger.debug('Correct logins: ' + userByCi.username);
    await this.usersService.updateLastLogin(userByCi._id);
    const userData = this.authService.login(userByCi);
    return userData;
  }

  @Authentication()
  @Get('renew')
  async renewToken(@GetUser() user: UserDocument) {
    this.logger.log('Renewing token for user ' + user.name);
    const userData = this.authService.login(user);
    return userData;
  }

  @ApiOkResponse({
    status: 200,
    description: 'Devuelve los datos del usuario con la cédula',
  })
  @ApiBadRequestResponse({
    status: 404,
    type: ErrorData,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorData,
  })
  @Get('verify-ci/:ci')
  async verifyCi(@Res() res: Response, @Param('ci') ci: string) {
    try {
      this.logger.log('Verifying ci ' + ci);
      const userData = await this.coacServices.getUser(ci);

      if (!userData)
        throw new NotFoundException('El usuario no es socio de la Cooperativa');

      return res.status(200).json(userData);
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 2));
      const errorData = getError(error);

      return res.status(errorData.statusCode).json(errorData);
    }
  }
}
