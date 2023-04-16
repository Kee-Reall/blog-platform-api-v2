import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TablesENUM } from '../Helpers/SQL';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private ds: DataSource) {}
  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async clearDb() {
    const res = await Promise.allSettled([
      this.ds.query(`DELETE FROM ${TablesENUM.USERS}`),
      this.ds.query(`DELETE FROM ${TablesENUM.USERS_BAN_LIST_BY_ADMIN}`),
      this.ds.query(`DELETE FROM ${TablesENUM.CONFIRMATIONS}`),
      this.ds.query(`DELETE FROM ${TablesENUM.RECOVERIES_INFO}`),
      this.ds.query(`DELETE FROM ${TablesENUM.SESSIONS}`),
    ]);
    console.log(res);
    return;
  }
  @Get('always-ok')
  public async alwaysOk(@Req() req: FastifyRequest) {
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
