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

  @Index('IDX_username', { unique: true })
  @Column({ unique: true })
  username: string;

  @Column()
  password?: string;

  @Index('IDX_email', { unique: true })
  @Column({ unique: true })
  email: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string | null;

  @Column({ nullable: true })
  country?: string | null;

  @Index('IDX_id_number', { unique: true })
  @Column({ name: 'id_number', unique: true, nullable: true })
  idNumber?: string | null;

  @Column({ nullable: true })
  selfie?: string | null;

  @Column({ name: 'id_card', nullable: true })
  idCard?: string | null;

  @Column({ nullable: true })
  birth?: string | null;

  @Column({ nullable: true })
  wallet?: string | null;

  @Column({ type: 'double', default: 0 })
  unverifiedBalance?: number;

  @Column({ name: 'mining_date', nullable: true })
  miningDate?: string | null;

  @Column({ name: 'mining_session', default: 0 })
  miningSession?: number;

  @Column({ type: 'double', default: 0 })
  transferableBalance?: number;

  @Column({ name: 'mapping_date', nullable: true })
  mappingDate?: string | null;

  @Column({ name: 'mapping_session', default: 0 })
  mappingSession?: number;

  @BeforeInsert()
  async hashPassword?() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
