import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('image')
  /**
   * image라는 key값에 파일을 넣어 보내야함
   * 그러면 posts.module에서 설정한 multer의 옵션대로 파일이 유효한지 확인함
   * 그리고 설정해둔 경로에 설정해둔 이름으로 이미지가 저장됨
   */
  @UseInterceptors(FileInterceptor('image'))
  postImage(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }
}
