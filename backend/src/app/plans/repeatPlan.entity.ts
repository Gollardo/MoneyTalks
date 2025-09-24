/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlannedOperation } from './plannedOperation.entity';

@Entity('repeat_plans')
export class RepeatPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['daily', 'weekly', 'monthly', 'yearly'] })
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @Column({ type: 'simple-array', nullable: true })
  daysOfWeek?: number[]; // [0-6] для weekly

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  occurrences?: number;

  @ManyToOne(() => PlannedOperation, (po) => po.repeatPlans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  plannedOperation: PlannedOperation;
}
