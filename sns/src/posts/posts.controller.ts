import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 모든 post를 가져온다.
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // id에 해당되는 post를 가져온다.
  @Get(':id')
  // ParseIntPipe는 값을 가져온 후 Int로 변경하여 돌려준다.
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // post를 생성한다.
  @Post()
  postPost(
    @Body('authorId') authorId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    // DefaulltValuePipe는 해당 값에 기본값을 설정해줌
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    isPublic;
    return this.postsService.createPost(+authorId, title, content);
  }

  // id와 일치하는 post를 수정한다.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  // id와 일치하는 post를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
