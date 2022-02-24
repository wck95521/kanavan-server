import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionConfigDto } from '../dto/transaction-config.dto';
import { UsersService } from '../users/users.service';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { TransferResponseDto } from '../dto/transfer.response.dto';

@Injectable()
export class TokenService {
  private readonly web3: Web3;
  private readonly contract: Contract;

  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const provider = new Web3.providers.HttpProvider(
      this.configService.get('CONTRACT_PROVIDER'),
    );
    this.web3 = new Web3(provider);
    this.contract = new this.web3.eth.Contract(
      this.configService.get('abi'),
      this.configService.get('CONTRACT_TO'),
    );
  }

  async sendToken(
    amount: number,
    address: string,
  ): Promise<TransferResponseDto> {
    const decimals = await this.contract.methods.decimals().call();
    // const amount = balance * Math.pow(10, decimals);
    const transactionConfig = new TransactionConfigDto();
    transactionConfig.from = this.configService.get('CONTRACT_FROM');
    transactionConfig.to = this.configService.get('CONTRACT_TO');
    transactionConfig.data = this.contract.methods
      .transfer(address, amount * Math.pow(10, decimals))
      .encodeABI();
    transactionConfig.gas = await this.web3.eth.estimateGas(transactionConfig);
    transactionConfig.nonce = await this.web3.eth.getTransactionCount(
      this.configService.get('CONTRACT_FROM'),
      'latest',
    );
    transactionConfig.gasPrice = await this.web3.eth.getGasPrice();
    const transactionHash = await this.sendTransaction(transactionConfig);
    return { transactionHash: transactionHash };
  }

  async transfer(username: string): Promise<TransferResponseDto> {
    const user = await this.usersService.findOne(username);
    if (user.balance > 0) {
      const sendToken = await this.sendToken(user.balance, user.walletAddress);
      await this.usersService.updateBalance(username, 0);
      return sendToken;
      // const decimals = await this.contract.methods.decimals().call();
      // const amount = user.balance * Math.pow(10, decimals);
      // const transactionConfig = new TransactionDto();
      // transactionConfig.from = this.configService.get('CONTRACT_FROM');
      // transactionConfig.to = this.configService.get('CONTRACT_TO');
      // transactionConfig.data = this.contract.methods
      //   .transfer(user.ethAddress, amount)
      //   .encodeABI();
      // transactionConfig.gas = await this.web3.eth.estimateGas(
      //   transactionConfig,
      // );
      // transactionConfig.nonce = await this.web3.eth.getTransactionCount(
      //   this.configService.get('CONTRACT_FROM'),
      //   'latest',
      // );
      // transactionConfig.gasPrice = await this.web3.eth.getGasPrice();
      // const transactionHash = await this.sendTransaction(transactionConfig);
      // await this.usersService.updateBalance(username, 0);
      // return { transactionHash: transactionHash };
    }
    return { transactionHash: null };
  }

  async sendTransaction(
    transactionConfig: TransactionConfigDto,
  ): Promise<string> {
    try {
      const signedTransaction = await this.web3.eth.accounts.signTransaction(
        transactionConfig,
        this.configService.get('CONTRACT_PRIVATE_KEY'),
      );
      const transactionReceipt = await this.web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction,
      );
      return transactionReceipt.transactionHash;
    } catch (error) {
      const message = 'transaction error';
      this.logger.error(message, error);
      throw new BadRequestException(message);
    }
  }
}
