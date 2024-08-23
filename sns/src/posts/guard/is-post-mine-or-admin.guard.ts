import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RolesEnum } from 'src/users/const/roles.const';
import { PostsService } from '../posts.service';
import { Request } from 'express';
import { UsersModel } from 'src/users/entity/users.entity';

@Injectable()
export class IsPostMineOrAdmin implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user)
      throw new UnauthorizedException('사용자 정보를 가져올수 없습니다.');

    if (user.role == RolesEnum.ADMIN) return true;

    const postId = req.params.postId;

    if (!postId)
      throw new BadRequestException('PostId가 파라미터로 제공되어야 합니다.');

    const isOk = await this.postsService.isPostMine(user.id, +postId);

    if (!isOk) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
}
