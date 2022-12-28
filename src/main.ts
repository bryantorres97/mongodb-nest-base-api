import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  // Habilitar CORS
  app.enableCors();
  // Inicializar Swagger
  initSwagger(app);

  const config = app.get(ConfigService);
  const port = config.get('port');

  await app.listen(port);
  // Logs
  logger.log(`Server is running at ${await app.getUrl()}`);
  logger.log(`Swagger is running at ${await app.getUrl()}/docs`);
}
bootstrap();
