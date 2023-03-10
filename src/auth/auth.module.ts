import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';
import { UsersModule } from '../users/users.module';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/configuration';
import { CoacServicesModule } from '../coac-services/coac-services.module';
import { LoginLogsModule } from '../login-logs/login-logs.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(JWT_SECRET),
        signOptions: { expiresIn: config.get<string>(JWT_EXPIRES_IN) },
      }),
    }),
    CoacServicesModule,
    LoginLogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
