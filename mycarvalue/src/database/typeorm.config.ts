import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: "postgres", // 데이터베이스 종류
            url: "", // ex) postgresql://username:password@hostname:port/database
            host: "localhost", // 데이터베이스 서버 호스트
            port: 5432, // 데이터베이스 포트
            username: "postgres",
            password: "postgres",
            database: "nestjs-study", // 연결할 데이터베이스 이름
            synchronize: true, // 스키마 자동 동기화 (production에서는 false)
            dropSchema: false, // 애플리케이션 실행시 기존 스키마 삭제 여부
            keepConnectionAlive: true, // 애플리케이션 재시작 시 연결 유지
            logging: true, // 데이터베이스 쿼리 로깅 여부
            entities: [__dirname + "/../**/*.entity{.ts,.js}"], //중요! 엔티티 클래스 경로
            migrations: ["*.ts"],
        } as TypeOrmModuleOptions;
    }
}
