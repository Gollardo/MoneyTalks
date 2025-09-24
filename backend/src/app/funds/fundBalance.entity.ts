/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Fund } from './fund.entity';

@Entity('fund_balances')
export class FundBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Fund, (fund) => fund.balances, { onDelete: 'CASCADE' })
  @JoinColumn()
  fund: Fund;

  @ManyToOne(() => Account, (acc) => acc.fundBalances, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;
}
