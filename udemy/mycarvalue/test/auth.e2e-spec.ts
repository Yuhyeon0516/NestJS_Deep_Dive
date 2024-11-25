import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("Authentication System (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("회원가입 요청", async () => {
        const EMAIL = "test132@test.com";
        const res = await request(app.getHttpServer())
            .post("/auth/signup")
            .send({
                email: EMAIL,
                password: "password",
            })
            .expect(201);
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(EMAIL);
    });

    it("회원가입 후 현재 사용자를 가져오기", async () => {
        const EMAIL = "test123@test.com";

        const res = await request(app.getHttpServer())
            .post("/auth/signup")
            .send({ email: EMAIL, password: "password" })
            .expect(201);

        const cookie = res.get("Set-Cookie");

        const { body } = await request(app.getHttpServer())
            .get("/auth/whoami")
            .set("Cookie", cookie)
            .expect(200);

        expect(body.email).toEqual(EMAIL);
    });
});
