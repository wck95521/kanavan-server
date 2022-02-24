import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.usersRepository.findOne({ username: username });
  }

  async create(
    username: string,
    emailAddress: string,
    walletAddress: string,
    password: string,
  ): Promise<User> {
    const findUser = await this.findOne(username);
    if (findUser) {
      throw new BadRequestException('duplicate username error');
    }
    const createUser = this.usersRepository.create({
      username: username,
      emailAddress: emailAddress,
      walletAddress: walletAddress,
      password: password,
    });
    const saveUser = await this.usersRepository.save(createUser);
    return { username: username, id: saveUser.id };
  }

  async verifyEmail(username: string): Promise<User> {
    const findUser = await this.findOne(username);
    findUser.emailVerification = true;
    const saveUser = await this.usersRepository.save(findUser);
    return { username: username, id: saveUser.id };
  }

  async updateBalance(username: string, amount: number): Promise<User> {
    const findUser = await this.findOne(username);
    findUser.balance = amount;
    const saveUser = await this.usersRepository.save(findUser);
    return { username: username, id: saveUser.id };
  }

  async mining(username: string): Promise<User> {
    const findUser = await this.findOne(username);
    const today = new Date();
    const miningDate = new Date(findUser.miningDate);
    if (findUser.miningDate === '') {
      findUser.miningDate = today.toISOString();
    } else if (
      today.getTime() >=
      miningDate.getTime() +
        parseInt(this.configService.get('MINING_PERIOD'), 10)
    ) {
      findUser.miningDate = today.toISOString();
      findUser.balance += parseFloat(this.configService.get('MINING_RATE'));
      findUser.miningSession += 1;
    }
    const saveUser = await this.usersRepository.save(findUser);
    return { username: username, id: saveUser.id };
  }
}
