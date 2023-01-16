import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/';
import { addDays } from 'date-fns';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  login(user: UserDocument) {
    const { _id } = user;
    const payload = { sub: _id };
    // TODO - Cambiar parametrizacion a variable de entorno
    const minValidDate = addDays(new Date(), -1);
    return {
      user,
      needPasswordChange: user.lastPasswordUpdated < minValidDate,
      needPinChange: user.lastPinUpdated < minValidDate,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
