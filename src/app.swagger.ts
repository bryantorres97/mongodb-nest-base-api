import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const initSwagger = (
  app: INestApplication,
  title?: string,
  description?: string,
) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(title || 'Proyecto básico de Nest.js')
    .setDescription(description || 'Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);
};
