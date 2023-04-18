import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';
import { VoidPromise } from '../../../Model';
import { NotFoundException } from '@nestjs/common';

export class DeleteUser {
  constructor(public userId: number) {}
}
@CommandHandler(DeleteUser)
export class DeleteUserUseCase implements ICommandHandler<DeleteUser> {
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute({ userId }: DeleteUser): VoidPromise {
    const user = await this.queryRepo.getUserBeforeDelete(userId);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.isDeleted) {
      throw new NotFoundException();
    }
    await this.commandRepo.deleteUser(userId);
    return;
  }
}
