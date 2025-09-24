import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({ default: 0 })
  @Exclude()
  failedLoginAttempts: number;
}
