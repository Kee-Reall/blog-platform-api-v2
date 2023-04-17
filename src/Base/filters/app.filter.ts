import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalHTTPFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const [errorsMessages, status, reply] = [
      exception.getResponse(),
      exception.getStatus(),
      host.switchToHttp().getResponse<Response>(),
    ];
    if (status === HttpStatus.BAD_REQUEST) {
      return reply.status(status).json(errorsMessages);
    }
    return reply.sendStatus(status);
  }
}
