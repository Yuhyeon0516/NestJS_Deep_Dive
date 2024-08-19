import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  ENV_DATABASE_HOST_KEY,
  ENV_DATABASE_PORT_KEY,
  ENV_POSTGRES_DB_KEY,
  ENV_POSTGRES_PASSWORD_KEY,
  ENV_POSTGRES_USER_KEY,
} from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FORDER_PATH } from './common/const/path.const';
import { ImageModel } from './common/entity/image.entity';
import { LogMiddleware } from './common/middleware/log.middleware';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entity/chats.entity';
import { MessagesModel } from './chats/messages/entity/messages.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DATABASE_HOST_KEY],
      port: parseInt(process.env[ENV_DATABASE_PORT_KEY]),
      username: process.env[ENV_POSTGRES_USER_KEY],
      password: process.env[ENV_POSTGRES_PASSWORD_KEY],
      database: process.env[ENV_POSTGRES_DB_KEY],
      entities: [PostsModel, UsersModel, ImageModel, ChatsModel, MessagesModel],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      // 아래와 같이 public 폴더의 경로를 설정하고 4022.jpg라는 이미지를 가져오려면
      // http://localhost:3000/public/posts/4022.jpg가 아닌
      // http://localhost:3000/posts/4022.jpg가 이렇게 됨
      rootPath: PUBLIC_FORDER_PATH,
      // 그래서 아래와 같이 public을 추가하면
      // http://localhost:3000/public//posts/4022.jpg로 됨
      serveRoot: '/public',
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    CommonModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
