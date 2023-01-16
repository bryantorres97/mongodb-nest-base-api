import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserCredentialsDto } from './dto/update-user-credentials.dto';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { getError } from '../common/helpers/manage-errors.helper';
import { ICreateUserResponse } from './interfaces/';
import { Authentication, GetUser } from '../auth/decorators';
import { UserDocument } from './schemas/user.schema';
// import { ICreateUserResponse } from '../../dist/users/interfaces/create-user-response.interface';
import { NotFoundException } from '@nestjs/common/exceptions';

import { Types } from 'mongoose';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: ICreateUserResponse,
  })
  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      this.logger.log('Creando un nuevo usuario', createUserDto);
      const user = await this.usersService.create(createUserDto);
      this.logger.log('Usuario creado', user);
      return res.status(201).json(user);
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 2));
      const errorData = getError(error);
      return res.status(errorData.statusCode).json(errorData);
    }
  }

  @Authentication()
  @Post('credentials')
  async updateCredentials(
    @Res() res: Response,
    @Body() updateUserCredentialsDto: UpdateUserCredentialsDto,
    @GetUser() user: UserDocument,
  ) {
    try {
      this.logger.log('Actualizando credenciales de usuario ' + user.ci);
      const userUpdated = await this.usersService.updateCredentials(
        user._id,
        updateUserCredentialsDto,
      );

      if (!userUpdated) {
        throw new NotFoundException('No se ha encontrado el usuario');
      }
      this.logger.log('Usuario' + user.ci + ' actualizado correctamente');
      return res.status(201).json(user);
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 2));
      const errorData = getError(error);
      return res.status(errorData.statusCode).json(errorData);
    }
  }

  @Patch(':id/unblock')
  async unblock(@Res() res: Response, @Param('id') id: string) {
    try {
      this.logger.log('Desbloqueando usuario ' + id);
      const userUpdated = await this.usersService.updateCredentials(
        new Types.ObjectId(id),
        {},
      );

      if (!userUpdated) {
        throw new NotFoundException('No se ha encontrado el usuario');
      }
      this.logger.log('Usuario' + id + ' desbloqueado correctamente');
      return res.status(201).json(userUpdated);
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 2));
      const errorData = getError(error);
      return res.status(errorData.statusCode).json(errorData);
    }
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ _id: id });
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserCredentialsDto,
  // ) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
