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
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { getError } from '../common/helpers/manage-errors.helper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

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
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ _id: id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
