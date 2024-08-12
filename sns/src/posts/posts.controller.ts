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
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 모든 post를 가져온다.
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // id에 해당되는 post를 가져온다.
  @Get(':id')
  // ParseIntPipe는 값을 가져온 후 Int로 변경하여 돌려준다.
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // post를 생성한다.
  @Post()
  @UseGuards(AccessTokenGuard)
  postPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    // DefaulltValuePipe는 해당 값에 기본값을 설정해줌
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    isPublic;
    return this.postsService.createPost(userId, body);
  }

  // id와 일치하는 post를 수정한다.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  // id와 일치하는 post를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
