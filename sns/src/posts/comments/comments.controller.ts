import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
}
