import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.use(
        session({
            secret: "instead",
            resave: false,
            saveUninitialized: false,
        }),
    );
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO에 선언한 형식을 제외한 다른 속성은 들어와도 무시함
        }),
    );
    await app.listen(3000);
}
bootstrap();
