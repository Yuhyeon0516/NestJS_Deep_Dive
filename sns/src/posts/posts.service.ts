import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: {
        author: true,
      },
    });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });

    if (!post) throw new NotFoundException();

    return post;
  }

  async createPost(authorId: number, title: string, content: string) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    return this.postsRepository.save(post);
  }

  async updatePost(id: number, title?: string, content?: string) {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException();

    if (title) post.title = title;
    if (content) post.content = content;

    return this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException();

    await this.postsRepository.delete(id);

    return id;
  }
}
