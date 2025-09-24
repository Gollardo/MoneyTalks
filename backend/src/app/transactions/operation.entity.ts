/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Category } from '../categories/categories.entity';
import { Fund } from '../funds/fund.entity';
import { Debt } from '../loans/debt.entity';

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['expense', 'income', 'transfer', 'lend', 'borrow'],
  })
  type: 'expense' | 'income' | 'transfer' | 'lend' | 'borrow';

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isPlanned: boolean;

  @Column({ default: false })
  isScheduled: boolean;

  @ManyToOne(() => Account, (acc) => acc.operations, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;

  @ManyToOne(() => Fund, { nullable: true })
  @JoinColumn()
  fund?: Fund;

  @ManyToOne(() => Debt, (debt) => debt.operations, { nullable: true })
  @JoinColumn()
  debt?: Debt;

  @ManyToOne(() => Category)
  category: Category;
}
