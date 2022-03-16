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
      user.email,
      user.password,
      user.country,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOneByUsername(@RequestUser() user: User): Promise<User> {
    return this.usersService.findOneByUsernameWithoutPassword(user.username);
  }

  @Get('supply')
  async getCurrentSupply(): Promise<any> {
    return this.usersService.getCurrentSupply();
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('verify-email')
  // async verifyEmail(@RequestUser() user: User): Promise<User> {
  //   return await this.usersService.verifyEmail(user.username);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('mining')
  async mining(@RequestUser() user: User): Promise<User> {
    return await this.usersService.mining(user.username);
  }
}
