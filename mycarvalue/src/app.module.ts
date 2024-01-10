import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { Report } from "./reports/report.entity";
import { APP_PIPE } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // global하게 적용시킬것이기떄문
            envFilePath: `.env.${process.env.NODE_ENV}`, // 현재 환경에 맞게 .env를 가져오게함
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService], // ConfigService를 DI 시킴
            useFactory: (config: ConfigService) => {
                // config에 읽어온 .env의 내용이 들어있음
                return {
                    type: "sqlite",
                    database: config.get<string>("DB_NAME"),
                    entities: [User, Report],
                    synchronize: true,
                };
            },
        }),
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes("*");
        consumer
            .apply(
                session({
                    secret: "instead",
                    resave: false,
                    saveUninitialized: false,
                }),
            )
            .forRoutes("*");
    }
}
