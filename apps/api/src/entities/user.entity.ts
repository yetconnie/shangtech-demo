import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OperationLog } from './operation-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'admin',
  })
  role: 'admin' | 'editor';

  @Column({ type: 'datetime', name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OperationLog, (log: OperationLog) => log.user)
  operationLogs: OperationLog[];
}