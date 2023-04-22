import { ImATeapotException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Contract } from '../../../Base';
import { BlogInputModel, BlogPresentationModel } from '../../../Model';
import { BloggerCommandRepository } from '../../repos';

export class CreateBlog implements BlogInputModel {
  public description: string;

  public name: string;
  public websiteUrl: string;
  constructor(public userId: number, dto: BlogInputModel) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

@CommandHandler(CreateBlog)
export class CreateBlogUseCase implements ICommandHandler<CreateBlog> {
  constructor(private commandRepo: BloggerCommandRepository) {}

  /* JwtGuard уже проверил и существования юзера и его статусы, поэтому тут это не требуется! */
  /* в случае замены REST презентационного слоя, убедится что он проверяет это */
  /* или добавить проверку здесь ! */
  public async execute(command: CreateBlog): Promise<BlogPresentationModel> {
    const contract: Contract<BlogPresentationModel> =
      await this.commandRepo.crateBlog(command);
    if (contract.isFailed()) {
      throw new ImATeapotException();
    }
    return contract.getPayload();
  }
}
