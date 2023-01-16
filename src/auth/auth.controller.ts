import {
  Controller,
  Logger,
  UseGuards,
  Post,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication, GetUser } from './decorators';
import { LoginDto } from './dto';
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

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly coacServices: CoacServicesService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() loginDto: LoginDto,
    @GetUser() user: UserDocument,
  ) {
    this.logger.log('Logging in user ' + loginDto.username);
    const ipAddress = req.socket.remoteAddress;
    this.logger.log('IP Address: ' + ipAddress);
    const ipAddresses =
      req.header('x-forwarded-for') || req.socket.remoteAddress;
    console.log(
      '🚀 ~ file: auth.controller.ts:49 ~ AuthController ~ ipAddresses',
      ipAddresses,
    );
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
