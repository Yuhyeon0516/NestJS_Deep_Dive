import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Throttle } from '../decorator/throttle.decorator';

@Injectable()
export class ThrottleInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManater: Cache,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const userId = req?.user?.sub;

    if (!userId) {
      return next.handle();
    }

    const throttlerOptions = this.reflector.get<{
      count: number;
      unit: 'minute';
    }>(Throttle, context.getHandler());

    if (!throttlerOptions) {
      return next.handle();
    }

    const date = new Date();
    const minute = date.getMinutes();

    const key = `${req.method}_${req.path}_${userId}_${minute}`;

    const count = await this.cacheManater.get<number>(key);

    if (count && count >= throttlerOptions.count) {
      throw new ForbiddenException('요청 가능 횟수를 넘어섰습니다.');
    }

    return next.handle().pipe(
      tap(async () => {
        const count = (await this.cacheManater.get<number>(key)) ?? 0;
        await this.cacheManater.set(key, count + 1, 60000);
      }),
    );
  }
}
