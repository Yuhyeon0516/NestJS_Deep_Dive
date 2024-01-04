import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller("auth")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post("/signup")
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
    }

    // url은 string형태로 들어와서 entity에서 id가 number여도 받을때는 string으로 받아야함
    @Get("/:id")
    findUser(@Param("id") id: string) {
        return this.usersService.findOne(parseInt(id));
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
