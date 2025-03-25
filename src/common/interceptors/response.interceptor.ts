import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse> {
    const responseContext = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response) => {
        const defaultResponse: IResponse = {
          success: response?.success !== undefined ? response.success : true,
          code: response?.code || 200,
          message: response?.message || 'Request processed successfully.',
          data: response?.data !== undefined ? response.data : null,
          total: response?.total || undefined,
          meta: response?.meta || {},
        };

        // Dynamically set the HTTP status code
        responseContext.status(defaultResponse.code);

        return defaultResponse;
      }),
    );
  }
}
