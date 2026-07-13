import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from '../../entities/insight.entity';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Insight)
    private insightRepository: Repository<Insight>,
  ) {}

  async create(createInsightDto: CreateInsightDto): Promise<Insight> {
    const insight = this.insightRepository.create(createInsightDto as any);
    return this.insightRepository.save(insight as any);
  }

  async findAll(status?: string): Promise<Insight[]> {
    const queryBuilder = this.insightRepository.createQueryBuilder('insight');

    if (status) {
      queryBuilder.where('insight.status = :status', { status });
    }

    queryBuilder
      .orderBy('insight.sortOrder', 'ASC')
      .addOrderBy('insight.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Insight> {
    const insight = await this.insightRepository.findOne({
      where: { id },
    });

    if (!insight) {
      throw new NotFoundException('洞察不存在');
    }

    return insight;
  }

  async update(id: string, updateInsightDto: UpdateInsightDto): Promise<Insight> {
    const insight = await this.findOne(id);
    Object.assign(insight, updateInsightDto);
    return this.insightRepository.save(insight);
  }

  async remove(id: string): Promise<void> {
    const insight = await this.findOne(id);
    await this.insightRepository.remove(insight);
  }

  async updateStatus(id: string, status: string): Promise<Insight> {
    const insight = await this.findOne(id);
    insight.status = status as any;
    return this.insightRepository.save(insight);
  }
}
