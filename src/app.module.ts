import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoacServicesModule } from './coac-services/coac-services.module';
import configuration from './config/configuration';
import { DATABASE_URI } from './config/configuration';
import { OtpsModule } from './otps/otps.module';
import { LoginLogsModule } from './login-logs/login-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>(DATABASE_URI),
        };
      },
    }),
    UsersModule,
    AuthModule,
    CoacServicesModule,
    OtpsModule,
    LoginLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
