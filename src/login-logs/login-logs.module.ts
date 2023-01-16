import { Module } from '@nestjs/common';
import { LoginLogsService } from './login-logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginLogModelName, LoginLogSchema } from './schemas/login-log.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: LoginLogModelName,
        useFactory: () => {
          const schema = LoginLogSchema;
          // schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
  ],
  providers: [LoginLogsService],
  exports: [LoginLogsService],
})
export class LoginLogsModule {}
