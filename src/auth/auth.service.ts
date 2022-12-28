import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  login(user: UserDocument) {
    const { _id } = user;
    const payload = { sub: _id };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
