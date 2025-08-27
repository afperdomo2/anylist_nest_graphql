import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationPipeConfig } from './config/validation-pipe.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🛑 GraphQL Playground: http://localhost:${port}/graphql`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
