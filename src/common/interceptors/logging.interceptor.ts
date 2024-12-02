import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PrismaService } from '../database/prisma/prisma.service';
import { IRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: IRequest = context.switchToHttp().getRequest();
    const logData = {
      startDate: new Date(),
      method: req.method,
      url: req.url,
      userId: req.user?.id,
    };

    const startDate = Date.now();
    return next.handle().pipe(
      tap(async (): Promise<void> => {
        await this.prismaService.requestLog.create({
          data: {
            ...logData,
            endDate: new Date(),
            timeTaken: Date.now() - startDate,
          },
        });
      }),
      catchError((err) => {
        this.prismaService.requestLog
          .create({
            data: {
              ...logData,
              endDate: new Date(),
              timeTaken: Date.now() - startDate,
            },
          })
          .then();
        return throwError(err);
      }),
    );
  }
}
