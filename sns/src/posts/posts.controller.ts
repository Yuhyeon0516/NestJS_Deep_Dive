import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  // post를 생성한다.
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(author, title, content);
  }

  // id와 일치하는 post를 수정한다.
  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(+id, author, title, content);
  }

  // id와 일치하는 post를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
