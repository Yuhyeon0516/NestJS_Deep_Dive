import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UseInterceptors,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

interface ClassConstructor {
    new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        // request가 들어오면 실행되는 부분
        // url, method 등과 같은 정보가 context 들어있음
        return next.handle().pipe(
            map((data: any) => {
                // response가 전송되기 전에 실행되는 부분
                // response 될 data에 대한 정보가 data에 들어있음
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
