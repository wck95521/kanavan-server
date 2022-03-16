import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SendVerificationResponseDto } from '../dto/send-verification.response.dto';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import qs from 'qs';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/users.entity';

@Injectable()
export class MailService {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  createHtml(username: string, link: string): string {
    return (
      this.configService.get('MAIL_MESSAGE1') +
      username +
      this.configService.get('MAIL_MESSAGE2') +
      this.configService.get('MAIL_CUSTOMER_PORTAL') +
      this.configService.get('MAIL_MESSAGE3') +
      link +
      this.configService.get('MAIL_MESSAGE4') +
      this.configService.get('MAIL_MESSAGE5') +
      this.configService.get('MAIL_COMPANY')
    );
  }

  // async sendVerification(user: User): Promise<SendVerificationResponseDto> {
  //   const findUser = await this.usersService.findOne(user.username);
  //   const link =
  //     this.configService.get('MAIL_VERIFICATION_LINK') +
  //     this.authService.auth(user).accessToken;
  //   const html = this.createHtml(user.username, link);
  //   return await this.sendMail(findUser.emailAddress, html);
  // }

  async sendMail(
    to: string,
    html: string,
  ): Promise<SendVerificationResponseDto> {
    try {
      const result = this.httpService
        .post(
          this.configService.get('MAIL_URL'),
          qs.stringify({
            mail_from: this.configService.get('MAIL_FROM'),
            password: this.configService.get('MAIL_PASSWORD'),
            mail_to: to,
            subject: this.configService.get('MAIL_SUBJECT'),
            content: html,
            subtype: 'html',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(map((response) => response.data));
      return await lastValueFrom(result);
    } catch (error) {
      const message = 'send mail error';
      this.logger.error(message, error);
      throw new BadRequestException(message);
    }
  }
}
