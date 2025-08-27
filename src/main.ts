import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`🚀 Application is running on: http://localhost:3000`);
  logger.log(`🛑 GraphQL Playground: http://localhost:3000/graphql`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
