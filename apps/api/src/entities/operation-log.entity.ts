import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50, name: 'operation_type' })
  operationType: string;

  @Column({ type: 'varchar', length: 50, name: 'resource_type' })
  resourceType: string;

  @Column({ type: 'uuid', name: 'resource_id', nullable: true })
  resourceId: string;

  @Column({ type: 'jsonb', name: 'operation_details', nullable: true })
  operationDetails: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user: User) => user.operationLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}