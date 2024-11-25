import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * Request 요청이 들어온 타임스탬프를 찍는다.
     * [REQ] {요청 Path} {요청 시간}
     *
     * Response가 나갈때 타임스탬프를 찍는다.
     * [RES] {요청 Path} {응답 시간} {소요 시간}
     */

    // Request
    const req = context.switchToHttp().getRequest();

    // 요청 Path
    // ex: /posts
    const path = req.originalUrl;

    // 현재 타임스탬프
    const requestTime = new Date();

    // [REQ] {요청 Path} {요청 시간}
    console.log(`[REQ] ${path} ${requestTime.toLocaleString('kr')}`);

    // next.handle()을 실행하는 순간 라우트의 로직이 전부 실행되고 응답이 반한된다.
    // 즉 이전 로직은 요청에서 실행되는 것이고 next.handle()은 구현해둔 로직이 실행됨.
    // .pipe()를 통해 응답값이 전달됨.
    // tap은 값을 가져와서 확인만 가능, map은 응답을 변경 가능.
    // 기존 response의 값은 callback 함수의 observable로 들어옴
    return next.handle().pipe(
      tap(() => {
        const responseTime = new Date();

        console.log(
          `[RES] ${path} ${responseTime.toLocaleString('kr')} ${responseTime.getMilliseconds() - requestTime.getMilliseconds()}ms`,
        );
      }),
      // map((observable) => ({
      //   message: '응답을 변경하였습니다.',
      //   response: observable,
      // })),
    );
  }
}
