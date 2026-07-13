import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Case } from './case.entity';

export type ProductStatus = 'draft' | 'published' | 'offline';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  features: string[];

  @Column({ type: 'jsonb', default: {}, name: 'technical_params' })
  technicalParams: Record<string, any>;

  @Column({ type: 'jsonb', default: [], name: 'application_scenarios' })
  applicationScenarios: string[];

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({ type: 'jsonb', default: [] })
  documents: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft',
  })
  status: ProductStatus;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Case, (c: Case) => c.products)
  cases: Case[];
}
