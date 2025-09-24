import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Operation } from '../transactions/operation.entity';
import { FundBalance } from '../funds/fundBalance.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: ['expense', 'savings'] })
  type: 'expense' | 'savings';

  @OneToMany(() => Operation, (op) => op.account)
  operations: Operation[];

  @OneToMany(() => FundBalance, (fb) => fb.account)
  fundBalances: FundBalance[];
}
