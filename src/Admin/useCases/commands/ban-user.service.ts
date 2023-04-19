import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';
import {
  BanUserInputModel,
  UserPresentationModel,
  VoidPromise,
  WithBanInfo,
} from '../../../Model';

export class BanUser implements BanUserInputModel {
  public banReason: string;
  public isBanned: boolean;

  constructor(public userId: number, dto: BanUserInputModel) {
    this.banReason = dto.banReason;
    this.isBanned = dto.isBanned;
  }
}

@CommandHandler(BanUser)
export class BanUserUseCase implements ICommandHandler<BanUser> {
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute(command: BanUser): VoidPromise {
    const user = await this.queryRepo.getUser(command.userId);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.banInfo.isBanned) {
      if (command.isBanned) {
        await this.BannedBeforeAndBanedAfter(user, command.banReason);
      } else {
        await this.BannedBeforeAndNotBannedAfter(user);
      }
    } else {
      if (command.isBanned) {
        await this.NotBannedBeforeAndBanedAfter(user, command.banReason);
      }
    }
    return;
  }

  private async NotBannedBeforeAndBanedAfter(
    user: WithBanInfo<UserPresentationModel>,
    banReason: string,
  ): VoidPromise {
    return await this.commandRepo.banUser(+user.id, banReason);
  }
  private async BannedBeforeAndBanedAfter(
    user: WithBanInfo<UserPresentationModel>,
    banReason: string,
  ): VoidPromise {
    if (user.banInfo.banReason === banReason) {
      return;
    }
    await this.commandRepo.updateBanReason(+user.id, banReason);
  }
  private async BannedBeforeAndNotBannedAfter(
    user: WithBanInfo<UserPresentationModel>,
  ): VoidPromise {
    return await this.commandRepo.unbanUser(+user.id);
  }
}
