import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { initializeCache } from 'memcachelibrarybeta';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    // To do 
    const domain = req.get('Domain');
    // console.log(domain);
    if(domain) {
      initializeCache(domain);
    }

    const statusCode = ctx.getResponse().statusCode;
    return next.handle().pipe(map(data => ({ statusCode, data })));
  }
}