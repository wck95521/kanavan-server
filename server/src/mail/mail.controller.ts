import { Controller, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from '../users/users.decorator';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/users.entity';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('send-verification')
  // async sendVerification(@RequestUser() user: User) {
  //   return await this.mailService.sendVerification(user);
  // }
}
