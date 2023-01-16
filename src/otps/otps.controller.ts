import { Response } from 'express';
import { addMinutes } from 'date-fns';
import { generate as generateOtp } from 'otp-generator';
import { Controller, Get, Post, Param, Res, Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';

import { getError } from '../common/helpers/manage-errors.helper';
import { OtpsService } from './otps.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OTPS')
@Controller('otps')
export class OtpsController {
  logger = new Logger(OtpsController.name);
  constructor(private readonly otpsService: OtpsService) {}

  @Post()
  async create(@Res() res: Response) {
    try {
      this.logger.log('Creando un nuevo OTP');
      const otp = generateOtp(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      this.logger.log('OTP generado: ' + otp);
      const today = new Date();
      // TODO - Cambiar parametrizacion a variable de entorno
      const expiresAt = addMinutes(today, 5);
      this.logger.log('Fecha de expiración: ' + expiresAt);
      const otpData = await this.otpsService.create({ otp, expiresAt });
      if (!otpData)
        throw new BadRequestException('No se ha podido generar el OTP');

      this.logger.log('OTP creado');

      // TODO - Enviar SMS con el OTP
      return res.status(201).json(otpData);
    } catch (error) {
      this.logger.error(error);
      const errorData = getError(error);
      return res.status(errorData.statusCode).json(errorData);
    }
  }

  @Get('verify/:otp')
  async verify(@Param('otp') otp: string, @Res() res: Response) {
    try {
      this.logger.log('Verificando OTP ' + otp);
      const otpData = await this.otpsService.verify(otp);
      if (!otpData)
        throw new BadRequestException(
          'El OTP no es válido, expiró o ya fue verificado',
        );
      this.logger.log('OTP verificado');
      return res.status(200).json(otpData);
    } catch (error) {
      this.logger.error(error);
      const errorData = getError(error);
      return res.status(errorData.statusCode).json(errorData);
    }
  }

  // @Get()
  // findAll() {
  //   return this.otpsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpsService.findOne(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.otpsService.remove(+id);
  // }
}
