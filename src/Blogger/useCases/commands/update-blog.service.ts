import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModel, BlogWithExtended, VoidPromise } from '../../../Model';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import { BloggerService } from './blogger.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateBlog implements BlogInputModel {
  description: string;

  name: string;
  websiteUrl: string;
  planedDto: string;
  public userId: number;
  public blogId: number;
  constructor(
    userId: string,
    blogId: string,

    dto: BlogInputModel,
  ) {
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.name = dto.name;
    this.blogId = +blogId;
    this.userId = +userId;
  }
}

@CommandHandler(UpdateBlog)
export class UpdateBlogUseCase
  extends BloggerService
  implements ICommandHandler<UpdateBlog>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: UpdateBlog): VoidPromise {
    const blog: BlogWithExtended = await this.queryRepo.getBlogByIdWIthMeta(
      command.blogId,
    );
    if (!blog) {
      throw new NotFoundException();
    }
    const extended = blog.extendedInfo;
    const isBanned = extended.isBlogBanned || extended.isOwnerBanned;
    const isDeleted = extended.isOwnerDeleted || extended.isDeleted;
    if (isBanned || isDeleted) {
      throw new NotFoundException();
    }
    if (extended.ownerId !== command.userId) {
      throw new ForbiddenException();
    }
    console.log('should update');
    await this.commandRepo.updateBlog(blog.id, <BlogInputModel>command); //todo write this
    return;
    // const blog = await this.queryRepo.getBlogEntity(command.blogId);
    // if (!blog || blog._isBlogBanned) {
    //   throw new NotFoundException();
    // }
    // if (!this.isOwner(command.userId, blog._blogOwnerInfo.userId)) {
    //   throw new ForbiddenException();
    // }
    // const isSaved: boolean = await this.commandRepo.saveBlog(blog);
    // if (!isSaved) {
    //   throw new ImATeapotException();
    // }
    // const after: BlogInputModel = {
    //   description: blog.description,
    //   websiteUrl: blog.websiteUrl,
    //   name: blog.name,
    // };
    // if (this.shouldSave(command.planedDto, after)) {
    //   blog.description = command.description;
    //   blog.websiteUrl = command.websiteUrl;
    //   blog.name = command.name;
    //   if (!(await this.commandRepo.saveBlog(blog))) {
    //     throw new ImATeapotException();
    //   }
    // }
    return;
  }

  private shouldSave(planedDto: string, after: BlogInputModel): boolean {
    return planedDto !== JSON.stringify(after);
  }
}
