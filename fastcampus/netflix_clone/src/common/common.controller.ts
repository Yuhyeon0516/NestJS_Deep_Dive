import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('common')
export class CommonController {
  @Post('video')
  @UseInterceptors(
    FileInterceptor('video', {
      limits: {
        fileSize: 20000000,
      },
      fileFilter(req, file, callback) {
        if (file.mimetype !== 'video/mp4') {
          // false이면 파일 안받음
          return callback(
            new BadRequestException('mp4 형식의 파일만 업로드 가능합니다.'),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  createVideo(
    @UploadedFile()
    video: Express.Multer.File,
  ) {
    return {
      fileName: video.filename,
    };
  }
}