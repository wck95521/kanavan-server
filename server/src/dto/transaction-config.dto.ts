export class TransactionConfigDto {
  from: string;
  to?: string;
  nonce?: number;
  gasPrice?: string;
  data?: string;
  gas?: number;
  value?: number;
}
