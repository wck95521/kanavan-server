import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../users/users.entity';
import { TransferResponseDto } from '../dto/transfer.response.dto';
import { TokenService } from './token.service';
import { RequestUser } from '../users/users.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transfer(@RequestUser() user: User): Promise<TransferResponseDto> {
    return await this.tokenService.transfer(user.username);
  }

  @Post('send-token')
  async sendToken(@Body() body: any): Promise<TransferResponseDto> {
    return await this.tokenService.sendToken(body.amount, body.address);
  }
}
