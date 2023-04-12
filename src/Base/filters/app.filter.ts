import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class GlobalHTTPFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const [errorsMessages, status, reply] = [
      exception.getResponse(),
      exception.getStatus(),
      host.switchToHttp().getResponse<FastifyReply>(),
    ];
    if (status === HttpStatus.BAD_REQUEST) {
      return reply.code(status).send(errorsMessages);
    }
    return reply.code(status).send();
  }
}
