import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const qr = req.queryRunner;

    if (!qr) throw new InternalServerErrorException('Query Runner가 없습니다.');

    return qr;
  },
);
