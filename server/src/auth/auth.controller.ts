import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { RequestUser } from '../users/users.decorator';
import { User } from '../users/users.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RequestAccessToken } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  auth(@RequestUser() user: User) {
    return this.authService.auth(user);
  }

  @Get('refresh')
  refresh(@RequestAccessToken() accessToken: string) {
    return this.authService.refresh(accessToken);
  }
}
