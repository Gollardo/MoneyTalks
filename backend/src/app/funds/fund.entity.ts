/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Operation } from '../transactions/operation.entity';
import { FundBalance } from './fundBalance.entity';

@Entity('funds')
export class Fund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => FundBalance, (fb) => fb.fund)
  balances: FundBalance[];

  @OneToMany(() => Operation, (op) => op.fund)
  operations: Operation[];
}
