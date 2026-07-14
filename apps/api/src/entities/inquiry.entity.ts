import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type InquiryStatus = 'new' | 'read' | 'replied';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, name: 'product_interest' })
  productInterest: string;

  @Column({ type: 'text', default: '' })
  message: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'new',
  })
  status: InquiryStatus;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
