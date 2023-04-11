import { Body, Controller, Headers, Ip, Post, Res } from '@nestjs/common';
import { LoginInput } from '../validators/login.validator';
import { FastifyReply } from 'fastify';

@Controller('api/auth')
export class AuthController {
  @Post('login')
  public async login(
    @Res({ passthrough: true }) rep: FastifyReply,
    @Headers('user-agent') agent: string,
    @Body() dto: LoginInput,
    @Ip() ip: string,
  ) {
    return;
  }
}
