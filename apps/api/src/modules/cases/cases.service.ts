import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Case } from '../../entities/case.entity';
import { Product } from '../../entities/product.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const caseEntity = queryRunner.manager.create(Case, {
        clientName: createCaseDto.clientName,
        clientLogoUrl: createCaseDto.clientLogoUrl,
        projectName: createCaseDto.projectName,
        projectSummary: createCaseDto.projectSummary,
        clientBackground: createCaseDto.clientBackground,
        challenges: createCaseDto.challenges,
        solution: createCaseDto.solution,
        implementation: createCaseDto.implementation,
        results: createCaseDto.results || [],
        clientTestimonial: createCaseDto.clientTestimonial,
        images: createCaseDto.images || [],
        videos: createCaseDto.videos || [],
        status: createCaseDto.status || 'draft',
        sortOrder: createCaseDto.sortOrder || 0,
      });

      if (createCaseDto.productIds && createCaseDto.productIds.length > 0) {
        const products = await queryRunner.manager.findByIds(Product, createCaseDto.productIds);
        caseEntity.products = products;
      }

      await queryRunner.manager.save(caseEntity);
      await queryRunner.commitTransaction();

      return caseEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(status?: string): Promise<Case[]> {
    const queryBuilder = this.caseRepository.createQueryBuilder('case');

    if (status) {
      queryBuilder.where('case.status = :status', { status });
    }

    queryBuilder
      .leftJoinAndSelect('case.products', 'product')
      .orderBy('case.sortOrder', 'ASC')
      .addOrderBy('case.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Case> {
    const caseEntity = await this.caseRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!caseEntity) {
      throw new NotFoundException('案例不存在');
    }

    return caseEntity;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const caseEntity = await queryRunner.manager.findOne(Case, {
        where: { id },
        relations: ['products'],
      });

      if (!caseEntity) {
        throw new NotFoundException('案例不存在');
      }

      Object.assign(caseEntity, {
        clientName: updateCaseDto.clientName ?? caseEntity.clientName,
        clientLogoUrl: updateCaseDto.clientLogoUrl ?? caseEntity.clientLogoUrl,
        projectName: updateCaseDto.projectName ?? caseEntity.projectName,
        projectSummary: updateCaseDto.projectSummary ?? caseEntity.projectSummary,
        clientBackground: updateCaseDto.clientBackground ?? caseEntity.clientBackground,
        challenges: updateCaseDto.challenges ?? caseEntity.challenges,
        solution: updateCaseDto.solution ?? caseEntity.solution,
        implementation: updateCaseDto.implementation ?? caseEntity.implementation,
        results: updateCaseDto.results ?? caseEntity.results,
        clientTestimonial: updateCaseDto.clientTestimonial ?? caseEntity.clientTestimonial,
        images: updateCaseDto.images ?? caseEntity.images,
        videos: updateCaseDto.videos ?? caseEntity.videos,
        status: updateCaseDto.status ?? caseEntity.status,
        sortOrder: updateCaseDto.sortOrder ?? caseEntity.sortOrder,
      });

      if (updateCaseDto.productIds) {
        const products = await queryRunner.manager.findByIds(Product, updateCaseDto.productIds);
        caseEntity.products = products;
      }

      await queryRunner.manager.save(caseEntity);
      await queryRunner.commitTransaction();

      return caseEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const caseEntity = await this.findOne(id);
    await this.caseRepository.remove(caseEntity);
  }

  async updateStatus(id: string, status: string): Promise<Case> {
    const caseEntity = await this.findOne(id);
    caseEntity.status = status as any;
    return this.caseRepository.save(caseEntity);
  }
}