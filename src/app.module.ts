import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { determineDatabaseModule } from './utils/helper';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }), 
    determineDatabaseModule(), 
    TodoModule, 
    AuthModule, 
    UsersModule, 
  ], 
  controllers: [AppController],
  providers: [
    ConfigService,
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
