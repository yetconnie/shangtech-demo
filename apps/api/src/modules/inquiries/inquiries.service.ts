import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry, InquiryStatus } from '../../entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { MailService } from './services/mail.service';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    private readonly mailService: MailService,
  ) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiryRepository.create({
      name: createInquiryDto.name,
      company: createInquiryDto.company,
      position: createInquiryDto.position,
      email: createInquiryDto.email,
      phone: createInquiryDto.phone,
      productInterest: createInquiryDto.productInterest,
      message: createInquiryDto.message || '',
      status: 'new',
    });

    const saved = await this.inquiryRepository.save(inquiry);

    this.mailService
      .sendInquiryNotification(saved)
      .catch((err) => {
        console.error('邮件通知发送失败:', err);
      });

    return saved;
  }

  async findAll(): Promise<Inquiry[]> {
    return this.inquiryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiryRepository.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException('询价记录不存在');
    }
    return inquiry;
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    const inquiry = await this.findOne(id);
    inquiry.status = status;
    return this.inquiryRepository.save(inquiry);
  }
}

