import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  // user.profile과 연결하고 JoinColumn을 통해 ProfileModel에서 user.id로 가지고있음
  @OneToOne(() => UserModel, (user) => user.profile)
  user: UserModel;

  @Column()
  profileImg: string;
}
