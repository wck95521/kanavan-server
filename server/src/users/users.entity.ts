import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  username: string;

  @Column()
  password?: string;

  @Column({ name: 'email_address', default: '' })
  emailAddress?: string;

  @Column({ name: 'first_name', default: '' })
  firstName?: string;

  @Column({ name: 'last_name', default: '' })
  lastName?: string;

  @Column({ name: 'home_address1', default: '' })
  homeAddress1?: string;

  @Column({ name: 'home_address2', default: '' })
  homeAddress2?: string;

  @Column({ default: '' })
  city?: string;

  @Column({ default: '' })
  state?: string;

  @Column({ default: '' })
  country?: string;

  @Column({ name: 'zip_code', default: 0 })
  zipCode?: number;

  @Column({ name: 'country_code', default: 0 })
  countryCode?: number;

  @Column({ name: 'phone_number', default: 0 })
  phoneNumber?: number;

  @Column({ name: 'id_number', default: '' })
  idNumber?: string;

  @Column({ default: '' })
  secret?: string;

  @Column({ name: 'friend_secret1', default: '' })
  friendSecret1?: string;

  @Column({ name: 'friend_secret2', default: '' })
  friendSecret2?: string;

  @Column({ name: 'friend_secret3', default: '' })
  friendSecret3?: string;

  @Column({ default: 0 })
  birthmonth?: number;

  @Column({ default: 0 })
  birthyear?: number;

  @Column({ default: 0 })
  birthday?: number;

  @Column({ default: '' })
  gender?: string;

  @Column({ name: 'wallet_address', default: '' })
  walletAddress?: string;

  @Column({ type: 'double', default: 0 })
  balance?: number;

  @Column({ name: 'mining_date', default: '' })
  miningDate?: string;

  @Column({ name: 'mining_session', default: 0 })
  miningSession?: number;

  @Column({ name: 'email_verification', default: false })
  emailVerification?: boolean;

  @Column({ name: 'phone_number_verification', default: false })
  phoneNumberVerification?: boolean;

  @Column({ default: 0 })
  age?: number;

  @BeforeInsert()
  async hashPassword?() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
