import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const status = exception.getStatus();

    // 에러 발생 시 로그 취합 및 에러 모니터링 시스템 API Call
    // 등 여러 동작 가능

    // 아래같이 response를 수정하는 경우는 굉장히 드물다.
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toLocaleString('kr'),
      path: request.originalUrl,
    });
  }
}
