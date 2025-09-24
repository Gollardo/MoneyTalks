import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Operation } from '../operations/operation.entity';

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  comment?: string;

  @OneToMany(() => Operation, (op) => op.debt)
  operations: Operation[];
}
