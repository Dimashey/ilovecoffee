import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const reponse = context.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof reponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    reponse
      .status(status)
      .json({ ...error, timestamp: new Date().toISOString() });
  }
}
