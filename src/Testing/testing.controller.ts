import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('api/testing')
export class TestingController {
  @Get('always-ok')
  public async alwaysOk(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    console.log(reply);
    const {
      headers,
      hostname,
      routeConfig,
      routerPath,
      protocol,
      query,
      url,
      ip,
      body,
      params,
      ips,
      id,
    } = req;
    return {
      alwaysOkResponse: {
        headers,
        hostname,
        routeConfig,
        routerPath,
        protocol,
        query,
        url,
        ip,
        body,
        params,
        ips,
        id,
      },
    };
  }
}
