import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  traceId: string;
  timestamp: string;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiEnvelope<T>> {
    const request = context.switchToHttp().getRequest<{ traceId?: string }>();
    const traceId = request.traceId ?? 'no-trace';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        traceId,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}