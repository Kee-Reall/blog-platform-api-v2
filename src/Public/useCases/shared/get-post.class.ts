import {
  Direction,
  ExtendedLikesInfo,
  PostPresentationModel,
} from '../../../Model';

export abstract class GetPostsAbstract {
  protected getExtendedLikeInfo(): ExtendedLikesInfo {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
  }

  protected generatePostOrder(
    orderBy: keyof PostPresentationModel | string,
    direction: Direction,
  ): string {
    let str = 'ORDER BY ';
    switch (orderBy) {
      case 'blogId':
        str += `p."blogId`;
        break;
      case 'id':
        str += `p.id`;
        break;
      case 'content':
        str += `p.content`;
        break;
      case 'blogName':
        str += 'b."blogName"';
        break;
      case 'shortDescription':
        str += 'p."shortDescription"';
        break;
      case 'title':
        str += 'p.title';
        break;
      default:
        str += 'p."createdAt"';
        break;
    }
    direction = direction.toLowerCase() === 'asc' ? direction : 'DESC';
    str += ` ${direction}`;
    return str;
  }
}
