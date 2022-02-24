import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from './users.decorator';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.usersService.create(
      user.username,
      user.emailAddress,
      user.walletAddress,
      user.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@RequestUser() user: User): User {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(@RequestUser() user: User): Promise<User> {
    return await this.usersService.verifyEmail(user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mining')
  async mining(@RequestUser() user: User): Promise<User> {
    return await this.usersService.mining(user.username);
  }
}
