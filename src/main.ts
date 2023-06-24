import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Get the ConfigService
  const port = configService.get<number>('PORT') || 3000;
  console.log('Port listening on:', port);
  await app.listen(port);
}

bootstrap();
