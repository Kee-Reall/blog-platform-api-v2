import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VoidPromise } from '../../../Model';

export class DeleteUser {
  constructor(public userId: number) {}
}
@CommandHandler(DeleteUser)
export class DeleteUserUseCase implements ICommandHandler<DeleteUser> {
  //constructor(private commandRepo: AdminCommandRepository) {}
  public async execute({ userId }: DeleteUser): VoidPromise {
    // const isDeleted = await this.commandRepo.deleteUser(userId);
    // if (!isDeleted) {
    //   throw new NotFoundException();
    // }
    return;
  }
}
