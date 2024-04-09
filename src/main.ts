import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectCache } from 'memcachelibrarybeta';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await connectCache({ server: process.env.MEMCACHE_CONNECTION_STRING });
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 4000).then(() => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}
bootstrap();
