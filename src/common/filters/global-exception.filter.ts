import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'An unexpected error occurred.';

    // Ensure the response follows the standardized format
    const errorResponse = {
      success: false,
      code: status,
      message:
        typeof message === 'string'
          ? message
          : (message as any)?.message || 'An unexpected error occurred.',
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
