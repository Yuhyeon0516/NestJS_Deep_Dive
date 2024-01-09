import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";

@Controller("auth")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post("/signup")
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
    }

    @Serialize(UserDto)
    @Get("/:id")
    async findUser(@Param("id") id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException("유저를 찾을 수 없습니다.");
        }
        return user;
    }

    @Get()
    findAllUser(@Query("email") email: string) {
        return this.usersService.find(email);
    }

    @Delete("/:id")
    removeUser(@Param("id") id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
