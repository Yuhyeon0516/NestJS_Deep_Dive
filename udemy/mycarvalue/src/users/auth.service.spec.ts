import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

// Test의 묶음 블록의 제목을 설정
describe("AuthService", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    // 아래 테스트들이 실행되기 전 먼저 실행
    beforeEach(async () => {
        // 가짜 UsersService 생성
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email,
                );
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        };

        // Test용 module 생성
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                // UsersService를 의존성으로 요청할 경우 fakeUsersService를 제공함
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        // Providers로 넣어준 service에 AuthService를 가져옴
        service = module.get(AuthService);
    });

    it("AuthService 생성 테스트", async () => {
        // AuthService가 정상적으로 정의되었는지 확인
        expect(service).toBeDefined();
    });

    it("회원가입 시 비밀번호 암호화 / salt, hash값 구성이 잘 되었는지 확인", async () => {
        // AuthService를 이용하여 회원가입 진행
        const user = await service.signup("test@test.com", "12341234");

        // user.password가 입력된 password와 다른 암호화가 된 password인지 확인
        expect(user.password).not.toEqual("12341234");

        // user.password에서 salt와 hash를 뽑아와 존재하는지 확인
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it("이미 회원가입된 이메일이 존재할때 에러 발생", async () => {
        // Test 계정을 회원가입 시키고
        await service.signup("test@test.com", "12341234");

        // 이미 Test계정은 회원가입 되어있으니 service.signup했을때
        // BadRequestException이 발생하는지 확인
        await expect(
            service.signup("test@test.com", "12341234"),
        ).rejects.toThrow(BadRequestException);
    });

    it("로그인 시 존재하지 않는 이메일을 입력했을때 에러 발생", async () => {
        // service.signin했을때 NotFoundException이 발생하는지 확인
        await expect(
            service.signin("test@test.com", "12341234"),
        ).rejects.toThrow(NotFoundException);
    });

    it("로그인 시 비밀번호가 틀렸을때 에러 발생", async () => {
        // Test계정을 회원가입 시킴
        await service.signup("test@test.com", "12341234");

        // service.signin을 해서 이전에 가입한 password와 다른 password를 입력해서
        // BadRequestException이 발생하는지 확인
        await expect(
            service.signin("test@test.com", "password"),
        ).rejects.toThrow(BadRequestException);
    });

    it("로그인 시 이메일과 비밀번호가 일치할 때", async () => {
        // Test용 계정을 회원가입 시킴
        await service.signup("test@test.com", "password");

        // 위에 가입한 계정으로 로그인 후 user가 존재하는지 확인
        const user = await service.signin("test@test.com", "password");
        expect(user).toBeDefined();
    });
});
