import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // data의 변환을 허용
      transform: true,
      transformOptions: {
        // transform이 될 때 class-validator를 기반으로 변환
        enableImplicitConversion: true,
      },
      // validation decorator가 없는 property는 생략
      // 즉 미리 정의한 dto에 해당되는 것만 입력되게 됨
      whitelist: true,
      // whitelist에 해당되지 않는 값이 있다면 error를 발생시킴
      forbidNonWhitelisted: true,
    }),
  );

  // 아래와 같이 global하게 exception filter를 적용할 수 있음.
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
