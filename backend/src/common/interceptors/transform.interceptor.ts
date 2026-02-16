import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data is already in the correct format, return as is
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }

        // Wrap response in standard format
        const result: Response<T> = {
          data,
        };

        // Add metadata if pagination exists
        if (data?.meta) {
          result.meta = data.meta;
        }

        // Add pagination info from response headers if exists
        const totalPages = response.getHeader('X-Total-Pages');
        const totalItems = response.getHeader('X-Total-Count');
        if (totalPages || totalItems) {
          result.meta = result.meta || {};
          if (totalPages) result.meta.totalPages = totalPages;
          if (totalItems) result.meta.total = totalItems;
        }

        return result;
      }),
    );
  }
}
