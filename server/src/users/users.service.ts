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

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ username: username });
  }

  async findOneByUsernameWithoutPassword(username: string): Promise<User> {
    const { password, ...result } = await this.findOneByUsername(username);
    return result;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email: email });
  }

  async create(
    username: string,
    email: string,
    password: string,
    country: string,
  ): Promise<User> {
    const findOneByUsername = await this.findOneByUsername(username);
    if (findOneByUsername) {
      throw new BadRequestException('Duplicate username');
    }
    const findOneByEmail = await this.findOneByEmail(email);
    if (findOneByEmail) {
      throw new BadRequestException('Duplicate email');
    }
    const create = this.usersRepository.create({
      username: username,
      email: email,
      password: password,
      country: country,
    });
    const save = await this.usersRepository.save(create);
    return { username: username, email: email, id: save.id };
  }

  // async verifyEmail(username: string): Promise<User> {
  //   const findUser = await this.findOne(username);
  //   findUser.emailVerification = true;
  //   const saveUser = await this.usersRepository.save(findUser);
  //   return { username: username, id: saveUser.id };
  // }

  async updateTransferableBalance(
    username: string,
    transferableBalance: number,
  ): Promise<User> {
    const findOneByUsername = await this.findOneByUsername(username);
    findOneByUsername.transferableBalance = transferableBalance;
    const save = await this.usersRepository.save(findOneByUsername);
    return { username: username, email: save.email, id: save.id };
  }

  async getCurrentSupply() {
    const { sum } = await this.usersRepository
      .createQueryBuilder('users')
      .select('SUM(users.unverifiedBalance)', 'sum')
      .getRawOne();
    return { sum: sum };
  }

  async mining(username: string): Promise<User> {
    const findOneByUsername = await this.findOneByUsername(username);
    const today = new Date();
    const miningDate = new Date(findOneByUsername.miningDate);
    if (
      !findOneByUsername.miningDate ||
      today.getTime() >
        miningDate.getTime() +
          parseInt(this.configService.get('MINING_PERIOD'), 10)
    ) {
      findOneByUsername.miningDate = today.toISOString();
      findOneByUsername.unverifiedBalance += parseFloat(
        this.configService.get('MINING_RATE'),
      );
      findOneByUsername.miningSession++;
    }
    const save = await this.usersRepository.save(findOneByUsername);
    return { username: username, email: save.email, id: save.id };
  }
}
