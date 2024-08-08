import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostModel } from './post.entity';

@Entity()
export class TagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => PostModel, (post) => post.tags)
  posts: PostModel[];
}
