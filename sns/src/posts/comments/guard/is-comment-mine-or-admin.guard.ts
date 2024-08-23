import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentsService } from '../comments.service';
import { RolesEnum } from 'src/users/const/roles.const';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user) throw new UnauthorizedException('사용자 정보가 없습니다.');

    if (user.role === RolesEnum.ADMIN) return true;

    const commentId = req.params.commentId;

    if (!commentId)
      throw new BadRequestException('CommentId를 제공하여야 합니다.');

    const isOk = await this.commentsService.isCommentMine(user.id, +commentId);

    if (!isOk) throw new ForbiddenException('접근 권한이 없습니다.');

    return true;
  }
}
