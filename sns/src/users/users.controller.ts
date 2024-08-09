import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userseService: UsersService) {}

  @Post()
  postUser(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userseService.createUser(nickname, email, password);
  }

  @Get()
  getUsers() {
    return this.userseService.getAllUsers();
  }
}
