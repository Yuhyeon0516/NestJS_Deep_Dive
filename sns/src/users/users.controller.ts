import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './decorator/user.decorator';
import { UsersModel } from './entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userseService: UsersService) {}

  @Get()
  getUsers() {
    return this.userseService.getAllUsers();
  }

  @Get('follow/me')
  async getFollow(@User() user: UsersModel) {
    return this.userseService.getFollowers(user.id);
  }

  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.userseService.followUser(user.id, followeeId);

    return true;
  }
}
