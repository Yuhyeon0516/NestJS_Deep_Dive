import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel]),
    AuthModule,
    UsersModule,
    CommonModule,
    MulterModule.register({
      limits: {
        // byte 단위
        fileSize: 10000000,
      },
      fileFilter: (req, file, callback) => {
        /**
         * callback(에러, 파일유무)
         *
         * 첫번째 파라미터에는 에러가 있을경우 에러에 대한 정보를 넣어줌
         * 두번째 파라미터는 파일을 받을지 말지 boolean을 넣어준다
         */

        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return callback(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다'),
            false,
          );
        }

        return callback(null, true);
      },
      storage: multer.diskStorage({
        // 파일을 저장할 경로 설정
        destination: function (req, res, callback) {
          callback(null, POST_IMAGE_PATH);
        },
        // 파일의 이름을 설정
        filename: function (req, file, callback) {
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
