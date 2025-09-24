import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Category } from '../categories/categories.entity';
import { Fund } from '../funds/fund.entity';
import { Debt } from '../loans/debt.entity';
import { RepeatPlan } from './repeatPlan.entity';

@Entity('planned_operations')
export class PlannedOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['expense', 'income', 'transfer', 'lend', 'borrow'],
  })
  type: 'expense' | 'income' | 'transfer' | 'lend' | 'borrow';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn()
  account?: Account;

  @ManyToOne(() => Fund, { nullable: true })
  @JoinColumn()
  fund?: Fund;

  @ManyToOne(() => Debt, { nullable: true })
  @JoinColumn()
  debt?: Debt;

  @ManyToOne(() => Category)
  category: Category;

  @OneToMany(() => RepeatPlan, (rp) => rp.plannedOperation)
  repeatPlans: RepeatPlan[];
}
