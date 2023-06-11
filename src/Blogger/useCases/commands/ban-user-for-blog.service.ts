import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessageENUM } from '../../../Base';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import { BanUserForBlogInputModel, VoidPromise } from '../../../Model';

export class BanUserForBlog implements BanUserForBlogInputModel {
  public banReason: string;
  public blogId: string;
  public isBanned: boolean;

  constructor(
    public makerId: string | number,
    public userId: string,
    dto: BanUserForBlogInputModel,
  ) {
    this.banReason = dto.banReason;
    this.blogId = dto.blogId;
    this.isBanned = dto.isBanned;
  }
}

@CommandHandler(BanUserForBlog)
export class BloggerBanUserUseCase implements ICommandHandler<BanUserForBlog> {
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {}
  public async execute(command: BanUserForBlog): VoidPromise {
    console.log(command);
    const banInfo = await this.queryRepo.getUserBan(
      command.makerId,
      command.userId,
      command.blogId,
    );
    // const ban: BanDocument = await this.queryRepo.getBanEntity(
    //   command.ownerId,
    //   command.userId,
    //   command.blogId,
    // );
    // if (!ban && !command.isBanned) {
    //   return;
    // }
    // return ban ? this.updateBan(command, ban) : this.createBan(command);
    return;
  }
  private async updateBan(
    command: BanUserForBlog,
    //ban: BanDocument,
  ): VoidPromise {
    // if (command.isBanned && ban.isBanned) {
    //   if (command.banReason === ban.banReason) {
    //     return;
    //   }
    //   ban.banReason = command.banReason;
    //   await this.commandRepo.saveBan(ban);
    //   return;
    // } else {
    //   if (ban.isBanned && !command.isBanned) {
    //     await this.commandRepo.deleteBan(ban._id);
    //     return;
    //   }
    // }
    // if (!ban.isBanned && command.isBanned) {
    //   await this.commandRepo.deleteBan(ban._id);
    //   return;
    // }
    // // you never should get here
    // console.error('uncaught case');
    return;
  }

  private async createBan(command: BanUserForBlog): VoidPromise {
    // const [owner, user, blog]: [UserDocument, UserDocument, BlogDocument] =
    //   await Promise.all([
    //     this.queryRepo.getUserEntity(command.ownerId),
    //     this.queryRepo.getUserEntity(command.userId),
    //     this.queryRepo.getBlogEntity(command.blogId),
    //   ]);
    // if (!owner) {
    //   throw new ForbiddenException();
    // }
    // if (!user) {
    //   throw new NotFoundException();
    // }
    // if (!blog) {
    //   throw new BadRequestException(this.generateNotAllowMessage());
    // }
    //
    // if (blog._blogOwnerInfo.userId.toHexString() !== owner.id) {
    //   throw new ForbiddenException();
    // }
    // if (owner.id === user.id) {
    //   throw new ForbiddenException(); // blogger can't ban yourself
    // }
    // const ban = new this.mdl({
    //   ownerId: owner._id,
    //   bannedUserId: user._id,
    //   bannedUserLogin: user.login,
    //   blogId: blog._id,
    //   isBanned: command.isBanned,
    //   banReason: command.banReason,
    //   createdAt: user.createdAt,
    // });
    // const isSaved = await this.commandRepo.saveBan(ban);
    // if (!isSaved) {
    //   throw new ImATeapotException();
    // }
    // return;
  }

  private generateNotAllowMessage() {
    return {
      errorsMessages: [{ message: MessageENUM.NOT_EXIST, field: 'blogId' }],
    };
  }
}
