import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserInputModel, VoidPromise } from '../../../Model';

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
  public async execute(command: BanUser): VoidPromise {
    // const user = await this.queryRepo.getUserEntity(command.userId);
    // if (!user) {
    //   throw new NotFoundException();
    // }
    // let shouldSave = false;
    // if (user.banInfo.isBanned) {
    //   if (command.isBanned) {
    //     shouldSave = this.BannedBeforeAndBanedAfter(user, command.banReason);
    //   } else {
    //     shouldSave = await this.BannedBeforeAndNotBannedAfter(user);
    //   }
    // } else {
    //   if (command.isBanned) {
    //     shouldSave = await this.NotBannedBeforeAndBanedAfter(
    //       user,
    //       command.banReason,
    //     );
    //   }
    // }
    // if (shouldSave) {
    //   const isSaved = await this.commandRepo.saveUser(user);
    //   if (!isSaved) {
    //     throw new ImATeapotException();
    //   }
    // }
    return;
  }

  // private async NotBannedBeforeAndBanedAfter(
  //   user: UserDocument,
  //   banReason: string,
  // ): Promise<boolean> {
  //   user.banInfo.isBanned = true;
  //   user.banInfo.banReason = banReason;
  //   user.banInfo.banDate = new Date();
  //   return await this.commandRepo.banUserEntities(user._id, true);
  // }
  // private BannedBeforeAndBanedAfter(
  //   user: UserDocument,
  //   banReason: string,
  // ): boolean {
  //   if (user.banInfo.banReason === banReason) {
  //     return false;
  //   }
  //   user.banInfo.banReason = banReason;
  //   return true;
  // }
  // private async BannedBeforeAndNotBannedAfter(
  //   user: UserDocument,
  // ): Promise<boolean> {
  //   user.banInfo.isBanned = false;
  //   user.banInfo.banReason = null;
  //   user.banInfo.banDate = null;
  //   return await this.commandRepo.banUserEntities(user._id, false);
  // }
}
