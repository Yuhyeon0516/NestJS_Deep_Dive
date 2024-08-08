import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  // Entity Embedding
  // Entity로 선언하지 않은 class를 Entity class에 embedding 하는 것
  @Column(() => Name)
  name: Name;

  @Column()
  class: string;
}

@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;
}
