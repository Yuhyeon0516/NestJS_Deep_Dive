import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { NotFoundException } from "@nestjs/common";

describe("UsersController", () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeUsersService = {
            findOne: (id: number) => {
                return Promise.resolve({
                    id,
                    email: "test@test.com",
                    password: "password",
                } as User);
            },
            find: (email: string) => {
                return Promise.resolve([
                    { id: 1, email, password: "password" } as User,
                ]);
            },
            // remove: () => {},
            // update: () => {},
        };
        fakeAuthService = {
            // signup: () => {},
            signin: (email: string, password: string) => {
                return Promise.resolve({ id: 1, email, password } as User);
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("UsersController 생성 테스트", () => {
        expect(controller).toBeDefined();
    });

    it("findAllUser 함수에 주어진 email을 가진 user를 잘 반환하는지 확인", async () => {
        const users = await controller.findAllUser("test@test.com");

        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual("test@test.com");
    });

    it("findUser 함수에 주어진 id를 가진 user를 잘 반환하는지 확인", async () => {
        const user = await controller.findUser("1");

        expect(user).toBeDefined();
    });

    it("findUser 함수에 주어진 id를 가진 user가 없을때 에러 발생", async () => {
        fakeUsersService.findOne = () => null;

        await expect(controller.findUser("1")).rejects.toThrow(
            NotFoundException,
        );
    });

    it("signin 함수가 호출되었을때 session이 update되고 user를 잘 반환하는지 확인", async () => {
        const session = { userId: -10 };
        const user = await controller.signin(
            { email: "test@test.com", password: "password" },
            session,
        );

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });
});
