import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handle PostgreSQL error codes
    if (
      exception.code &&
      typeof exception.code === 'string' &&
      exception.code.match(/^\d+$/)
    ) {
      this.logger.error(
        `Database error: ${exception.code} - ${
          exception.detail || exception.message
        }`,
      );

      // Map database error codes to appropriate HTTP status codes
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'A database error occurred';

      // Handle specific PostgreSQL errors
      switch (exception.code) {
        case '23502': // not_null_violation
          status = HttpStatus.BAD_REQUEST;
          message = exception.detail || 'A required field cannot be null';
          break;
        case '23505': // unique_violation
          status = HttpStatus.CONFLICT;
          message =
            exception.detail || 'A record with this data already exists';
          break;
        case '23503': // foreign_key_violation
          status = HttpStatus.BAD_REQUEST;
          message = exception.detail || 'Referenced record does not exist';
          break;
        // Add more PostgreSQL error codes as needed
      }

      return response.status(status).json({
        success: false,
        code: status,
        message,
        data: null,
      });
    }

    // Handle HTTP exceptions
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'An unexpected error occurred.';

    // Log the error for unexpected server errors
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('Unexpected error', exception.stack);
    }

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
