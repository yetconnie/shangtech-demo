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

  @Column({ type: 'simple-json', default: [] })
  features: string[];

  @Column({ type: 'simple-json', default: {}, name: 'technical_params' })
  technicalParams: Record<string, any>;

  @Column({ type: 'simple-json', default: [], name: 'application_scenarios' })
  applicationScenarios: string[];

  @Column({ type: 'simple-json', default: [] })
  images: string[];

  @Column({ type: 'simple-json', default: [] })
  documents: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft',
  })
  status: ProductStatus;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Case, (c: Case) => c.products)
  cases: Case[];
}
