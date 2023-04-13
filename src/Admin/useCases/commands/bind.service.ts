import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VoidPromise } from '../../../Model';

export class BindBlog {
  constructor(public userId: number, public blogId: number) {}
}

@CommandHandler(BindBlog)
export class BindBlogUseCase implements ICommandHandler<BindBlog> {
  public async execute(command: BindBlog): VoidPromise {
    // const blog = await this.queryRepo.getBlogEntity(command.blogId);
    // if (!blog) {
    //   throw new NotFoundException();
    // }
    // if (blog._blogOwnerInfo.userId) {
    //   throw new BadRequestException({
    //     errorsMessages: [{ message: MessageENUM.NOT_ALLOW, field: 'blogId' }],
    //   });
    // }
    // const user = await this.queryRepo.getUserEntity(command.userId);
    // if (!user) {
    //   throw new NotFoundException();
    // }
    // blog._blogOwnerInfo.userId = user._id;
    // const isSaved = await this.commandRepo.saveBlog(blog);
    // if (!isSaved) {
    //   throw new ImATeapotException();
    // }
    return;
  }
}
