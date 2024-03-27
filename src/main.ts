import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectCache } from 'memcachelibrarybeta';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connectCache({ server: process.env.MEMCACHE_CONNECTION_STRING })
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
