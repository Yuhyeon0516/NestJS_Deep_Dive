import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    // 새로운 user가 생성될때마다 아래 함수가 실행됨
    @AfterInsert()
    logInsert() {
        console.log("사용자가 추가되었습니다. Id:", this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log("사용자가 삭제되었습니다. Id:", this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log("사용자가 변경되었습니다. id:", this.id);
    }
}