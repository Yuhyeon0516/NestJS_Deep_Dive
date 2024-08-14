import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { UsersModel } from 'src/users/entities/users.entity';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostImagesService } from './image/images.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postImagesService: PostImagesService,
    private readonly dataSource: DataSource,
  ) {}

  // 모든 post를 가져온다.
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
  }

  // id에 해당되는 post를 가져온다.
  @Get(':id')
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
  @UseGuards(AccessTokenGuard)
  async postPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    // DefaulltValuePipe는 해당 값에 기본값을 설정해줌
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // 쿼리 러너에 연결한다.
    await qr.connect();
    // 쿼리 러너에서 트랜잭션을 시작한다.
    // 이 시점부터 같은 쿼리 러너를 사용하면
    // 트랜잭션 안에서 데이터베이스 액션을 실행 할 수 있다.
    await qr.startTransaction();

    // 로직 실행
    try {
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

      await qr.commitTransaction();

      return this.postsService.getPostById(post.id);
    } catch (error) {
      // 어떤 에러든 에러가 나오면
      // 트랜잭션을 종료하고 원래 상태로 되돌림
      await qr.rollbackTransaction();
      throw new InternalServerErrorException('에러가 발생하였습니다.');
    } finally {
      await qr.release();
    }
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
