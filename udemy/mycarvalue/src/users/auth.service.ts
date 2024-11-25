import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // 이메일이 사용중인지 확인하기
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException("이미 가입된 이메일입니다.");
        }

        // 사용자 비밀번호 해쉬로 만들어 암호화하기
        const salt = randomBytes(8).toString("hex");
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + "." + hash.toString("hex");

        // 사용자 생성하기
        const user = this.usersService.create(email, result);

        // 사용자를 반환
        return user;
    }

    async signin(email: string, password: string) {
        // 이메일로 유저를 찾기
        // 가입할때 이메일 중복 확인을 해두어서
        // usersService.find는 array를 return해주나 무조건 1개만 있다고 가정이 가능
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException(
                "해당 이메일로 가입된 유저를 찾을 수 없습니다.",
            );
        }

        // 가져온 user정보에서 password를 가져와 salt.hash로 이루어진 상태를 split함수로 분리함
        const [salt, storedHash] = user.password.split(".");

        // 입력으로 들어온 password를 hash로 만들어서 비교
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString("hex")) {
            throw new BadRequestException("비밀번호가 일치하지않습니다.");
        }

        return user;
    }
}
