import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type InsightCategory = 'technology' | 'industry' | 'leadership';
export type InsightStatus = 'draft' | 'published' | 'offline';

@Entity('insights')
export class Insight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'technology',
  })
  category: InsightCategory;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft',
  })
  status: InsightStatus;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image' })
  coverImage: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'url' })
  url: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'author_name' })
  authorName: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'author_role' })
  authorRole: string;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'author_avatar' })
  authorAvatar: string;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
