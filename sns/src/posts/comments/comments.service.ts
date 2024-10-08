import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { CommentsModel } from './entity/comments.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { PostsModel } from '../entity/posts.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<CommentsModel>(CommentsModel)
      : this.commentsRepository;
  }

  paginateComments(dto: PaginateCommentsDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        ...DEFAULT_COMMENT_FIND_OPTIONS,
        where: {
          post: {
            id: postId,
          },
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: {
        id,
      },
    });

    if (!comment)
      throw new BadRequestException(`id: ${id} comment는 존재하지 않습니다.`);

    return comment;
  }

  async createComment(
    author: UsersModel,
    postId: number,
    dto: CreateCommentDto,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    return repository.save({
      ...dto,
      author,
      post: {
        id: postId,
      },
    });
  }

  async updateComment(commentId: number, dto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw new NotFoundException('comment를 찾을 수 없습니다.');

    const prevComment = await this.commentsRepository.preload({
      id: commentId,
      ...dto,
    });
    const newComment = await this.commentsRepository.save(prevComment);

    return newComment;
  }

  async deleteComment(commentId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    const comment = await repository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw new NotFoundException('comment를 찾을 수 없습니다.');

    await repository.delete(commentId);

    return;
  }

  async isCommentMine(userId: number, commentId: number) {
    return this.commentsRepository.exists({
      where: {
        id: commentId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }
}
