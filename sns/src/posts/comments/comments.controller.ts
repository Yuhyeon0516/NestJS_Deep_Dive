import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/decorator/user.decorator';
import { PostsService } from '../posts.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  /**
   * 1. entity 생성
   *    id -> primary key
   *    author -> 작성자
   *    post -> 귀속되는 post
   *    comment -> 실제 댓글 내용
   *    likeCount -> 좋아요 갯수
   *    createdAt -> 생성일
   *    updatedAt -> 수정일
   *
   * 2. get(/) paginate
   * 3. get(':commentId') 특정 comment만 하나 가져오는 기능
   * 4. post() 코맨트 생성하는 기능
   * 5. patch(':commentId') 특정 comment 업데이트 기능
   * 6. delete(':commentId) 특정 comment 삭제
   */

  @Get()
  @IsPublic()
  getComments(
    @Query() dto: PaginateCommentsDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.commentsService.paginateComments(dto, postId);
  }

  @Get(':commentId')
  @IsPublic()
  getComment(@Param('commentId', ParseIntPipe) id: number) {
    return this.commentsService.getCommentById(id);
  }

  @Post()
  async postComment(
    @User() user: UsersModel,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentDto,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post)
      throw new BadRequestException(`id: ${postId} post는 존재하지 않습니다.`);

    return this.commentsService.createComment(user, post, body);
  }

  @Patch(':commentId')
  patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, body);
  }

  @Delete(':commentId')
  deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.deleteComment(commentId);
  }
}
