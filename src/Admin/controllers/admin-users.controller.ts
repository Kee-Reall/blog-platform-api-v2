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
import { IUserPaginationConfig } from '../../Model';
import { adminCommand, adminQuery } from '../useCases';
import { BanUserInput, UserInput } from '../validators';
import { UserPaginationPipe } from '../pipes/userPagination.pipe';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class AdminUsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public async getUsersForAdmin(
    @Query(UserPaginationPipe) cfg: IUserPaginationConfig,
  ) {
    return await this.queryBus.execute(new adminQuery.GetPaginatedUsers(cfg));
  }

  @Post()
  public async createUser(@Body() dto: UserInput) {
    return await this.commandBus.execute(new adminCommand.CreateUser(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.commandBus.execute(new adminCommand.DeleteUser(userId));
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: BanUserInput,
  ) {
    return await this.commandBus.execute(new adminCommand.BanUser(userId, dto));
  }
}
