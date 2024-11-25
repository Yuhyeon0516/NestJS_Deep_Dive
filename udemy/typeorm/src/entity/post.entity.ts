import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { TagModel } from './tag.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // Post가 Many니까 ManyToOne
  // Relation 상대에 대한 id를 가지고 있는 애는 무조건 Many 측에서
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  // ManyToMany도 주체가 되는 애한테 JoinTable을 넣어줘야함
  @ManyToMany(() => TagModel, (tag) => tag.posts)
  @JoinTable()
  tags: TagModel[];
}
