import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';

export type CaseStatus = 'draft' | 'published' | 'offline';

export interface CaseResult {
  metric: string;
  value: string;
  description?: string;
}

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'client_name' })
  clientName: string;

  @Column({ type: 'text', name: 'client_logo_url', nullable: true })
  clientLogoUrl: string;

  @Column({ type: 'varchar', length: 255, name: 'project_name' })
  projectName: string;

  @Column({ type: 'text', name: 'project_summary' })
  projectSummary: string;

  @Column({ type: 'text', name: 'client_background', nullable: true })
  clientBackground: string;

  @Column({ type: 'text', nullable: true })
  challenges: string;

  @Column({ type: 'text', nullable: true })
  solution: string;

  @Column({ type: 'text', nullable: true })
  implementation: string;

  @Column({ type: 'simple-json', default: [] })
  results: CaseResult[];

  @Column({ type: 'text', name: 'client_testimonial', nullable: true })
  clientTestimonial: string;

  @Column({ type: 'simple-json', default: [] })
  images: string[];

  @Column({ type: 'simple-json', default: [] })
  videos: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft',
  })
  status: CaseStatus;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Product, (p: Product) => p.cases)
  @JoinTable({
    name: 'case_products',
    joinColumn: { name: 'case_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
