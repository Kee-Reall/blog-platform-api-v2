import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../guards';
import { UserPaginationPipe } from '../pipes';
import { ParseIntCustomPipe } from '../../Base';
import {
  IUserPaginationConfig,
  PaginatedOutput,
  UserPresentationModel,
  VoidPromise,
  WithBanInfo,
} from '../../Model';
import { adminCommand, adminQuery } from '../useCases';
import { BanUserInput, UserInput } from '../validators';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class AdminUsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public async getUsersForAdmin(
    @Query(UserPaginationPipe) cfg: IUserPaginationConfig,
  ): Promise<PaginatedOutput<WithBanInfo<UserPresentationModel>>> {
    return await this.queryBus.execute(new adminQuery.GetPaginatedUsers(cfg));
  }

  @Post()
  public async createUser(
    @Body() dto: UserInput,
  ): Promise<WithBanInfo<UserPresentationModel>> {
    return await this.commandBus.execute(new adminCommand.CreateUser(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(
    @Param('id', ParseIntCustomPipe) userId: number,
  ): VoidPromise {
    return await this.commandBus.execute(new adminCommand.DeleteUser(userId));
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: BanUserInput,
  ): VoidPromise {
    return await this.commandBus.execute(new adminCommand.BanUser(userId, dto));
  }
}
