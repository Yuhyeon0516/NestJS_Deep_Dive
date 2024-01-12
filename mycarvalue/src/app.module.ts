import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_PIPE } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeormConfig } from "./database/typeorm.config";
import { DataSource, DataSourceOptions } from "typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // global하게 적용시킬것이기떄문
            envFilePath: `.env.${process.env.NODE_ENV}`, // 현재 환경에 맞게 .env를 가져오게함
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeormConfig,
            dataSourceFactory: async (options: DataSourceOptions) => {
                return new DataSource(options).initialize();
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
    constructor(private configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes("*");
        consumer
            .apply(
                session({
                    secret: this.configService.get("COOKIE_SECRET"),
                    resave: false,
                    saveUninitialized: false,
                }),
            )
            .forRoutes("*");
    }
}
