import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validationPipeConfig } from './config/validation-pipe.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  const documentBuilder = new DocumentBuilder()
    .setTitle('Anylist API')
    .setDescription('Anylist API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🛑 GraphQL Playground: http://localhost:${port}/graphql`);
  logger.log(`📜 Swagger Docs: http://localhost:${port}/api/docs`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
