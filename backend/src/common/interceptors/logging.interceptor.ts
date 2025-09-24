/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, user, reqId, ip, userAgent } = request;

    this.logger.log(
      `➡ ${method} ${originalUrl} | reqId=${reqId} | user=${user?.userId || 'anon'} | ip=${ip} | agent=${userAgent}`,
    );

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(
          `⬅ ${method} ${originalUrl} | ${delay}ms | reqId=${reqId}`,
        );
      }),
    );
  }
}
