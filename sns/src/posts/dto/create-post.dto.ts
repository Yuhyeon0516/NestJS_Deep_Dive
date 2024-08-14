import { IsOptional, IsString } from 'class-validator';
import { PostsModel } from '../entities/posts.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  @IsString({
    // 이게 array로 이루어져있다.
    each: true,
  })
  @IsOptional()
  images: string[] = [];
}
