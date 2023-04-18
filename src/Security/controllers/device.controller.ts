import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Meta, ParseIntCustomPipe } from '../../Base';
import { command, query } from '../useCases';
import { RefreshJwtAuthGuard } from '../guard';
import { SessionJwtMeta, VoidPromise } from '../../Model';

@Controller('security/devices')
@UseGuards(RefreshJwtAuthGuard)
export class DeviceController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getDevices(@Meta() userMeta: SessionJwtMeta) {
    console.log('sa');
    //return await this.queryBus.execute(new query.GetSessions(userMeta));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSessionsExcludeCurrent(
    @Meta() userMeta: SessionJwtMeta,
  ): VoidPromise {
    // await this.commandBus.execute(
    //   new command.KillAllSessionsExcludeCurrent(userMeta),
    // );
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSessionById(
    @Meta() userMeta: SessionJwtMeta,
    @Param('id', ParseIntCustomPipe) deviceId: number,
  ): VoidPromise {
    await this.commandBus.execute(new command.KillSession(deviceId, userMeta));
    return;
  }
}
