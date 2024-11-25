import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Column({
  //   // 데이터베이스에서 인지하는 칼럼의 타입
  //   // 입력 안해도 자동 유추됨.
  //   type: 'varchar',

  //   // 데이터베이스에서 사용할 칼럼 이름
  //   // 입력 안하면 프로퍼티 이름으로 자동 유추됨.
  //   name: '_title',

  //   // 값의 길이
  //   length: 10,

  //   // null이 가능한지
  //   nullable: true,

  //   // true이면 처음 저장할때만 값 지정 가능
  //   // 이후에는 변경 불가능
  //   update: false,

  //   // find()를 실행할때 기본으로 값을 불러올지
  //   select: true,

  //   // 아무것도 입력하지 않았을때의 기본값
  //   default: '기본 제목',

  //   // 칼럼 중에서 유일무이한 값이 되어야하는지
  //   unique: false,
  // })
  // title: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column()
  @Generated('increment')
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    // true로 설정 시 find 실행 할때마다 항상 relation 값도 같이 가져올 수 있도록하는
    eager: false,
    // 저장할때 relation을 한번에 같이 저장함(app.controller.ts에 추가 설명 있음)
    cascade: false,
    // null 값이 가능한지, 기본값은 true,
    nullable: true,
    // 관계가 삭제 됐을때의 행동
    // 상위부터 하위로 적용됨. 즉, 소유하고있는(JoinColumn, JoinTable) 테이블만 하위에 영향을 줄수있음
    // no action -> 아무것도 안함
    // cascade -> 참조하는 Row도 같이 삭제
    // set null -> 참조하는 row에서 참조 id를 null로 변경
    // set default -> 기본값으로 설정
    // restrict -> 참조하고 있는 row가 있다면 참조당하는 row는 삭제 불가
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  profile: ProfileModel;

  // user 한명이 post는 여러개 작성할 수 있기때문에 OneToMany
  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @Column({
    default: 0,
  })
  count: number;
}
