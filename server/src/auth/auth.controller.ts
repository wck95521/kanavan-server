import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { User } from '../users/users.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  auth(@Body() user: User) {
    return this.authService.auth(user);
  }
}
