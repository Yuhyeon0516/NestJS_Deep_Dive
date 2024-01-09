import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(function (
    data: never,
    context: ExecutionContext,
) {
    // data는 decorator를 사용할때 매개변수로 넘겨주는 값을 가지고있음
    // context는 통신과 관련된 모든 내용을 가지고있음

    const request = context.switchToHttp().getRequest();
    return request.currentUser;
});
