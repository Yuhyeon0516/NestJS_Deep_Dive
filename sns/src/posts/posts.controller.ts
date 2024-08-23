import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { ImageModelType } from 'src/common/entity/image.entity';
import { QueryRunner as QR } from 'typeorm';
import { PostImagesService } from './image/images.service';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const/roles.const';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsPostMineOrAdmin } from './guard/is-post-mine-or-admin.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postImagesService: PostImagesService,
  ) {}

  // 모든 post를 가져온다.
  @Get()
  // 아래와 같이 interceptor 사용가능
  // @UseInterceptors(LogInterceptor)
  // 아래와 같이 route 단위로도 exception filter를 적용할 수 있음
  // @UseFilters(HttpExceptionFilter)
  @IsPublic()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
  }

  // id에 해당되는 post를 가져온다.
  @Get(':id')
  @IsPublic()
  // ParseIntPipe는 값을 가져온 후 Int로 변경하여 돌려준다.
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // post를 생성한다.
  // A Model, B Model이 있다고 가정
  // Post API는 아래와 같이 현재 A를 저장하고, B를 저장함
  // await this.postsService.createPostImage(body);
  // await this.postsService.createPost(userId, body);
  //
  // 만약 A를 저장하다 실패했을때 B를 저장하면 안될경우
  // 이를 해결하기 위해 Transaction을 사용함(대부분 SQL에서는 지원함)
  // all or noting(전부 성공하거나 전부 실패하거나)
  //
  // Transaction
  // start -> 시작
  // commit -> 저장
  // rollback -> 원상복구
  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
  ) {
    // 로직 실행
    const post = await this.postsService.createPost(userId, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.postImagesService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );
    }

    return this.postsService.getPostById(post.id, qr);
  }

  // id와 일치하는 post를 수정한다.
  @Patch(':postId')
  @UseGuards(IsPostMineOrAdmin)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  // id와 일치하는 post를 삭제한다.
  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  // RBAC -> Role Based Access Control
}
