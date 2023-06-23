import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Get the ConfigService
  await app.listen(configService.get<number>('PORT')); //
}

console.log('Port listening on:', process.env.PORT);
bootstrap();
