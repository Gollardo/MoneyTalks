import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // доход / расход
  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @ManyToOne(() => Category, (c) => c.children, { nullable: true })
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent)
  children: Category[];
}
