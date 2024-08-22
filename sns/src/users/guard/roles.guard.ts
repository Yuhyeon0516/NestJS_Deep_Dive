import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Roles annotaion에 대한 metadata를 가져와야함
     * Reflector를 이용하여 가져온다.
     * getAllAndOverride() => key를 넣어주면 해당 annotaion에 대한 가장 가까운 정보를 가져옴
     */

    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      // 현재 실행되는 함수
      context.getHandler(),
      // 현재 실행되는 controller
      context.getClass(),
    ]);

    // Roles Annotaion이 등록이 안되어 있을때
    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    if (user.role !== requiredRole) {
      throw new ForbiddenException(
        `이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한이 필요합니다.`,
      );
    }

    return true;
  }
}
