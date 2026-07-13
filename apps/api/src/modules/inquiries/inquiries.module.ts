import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { MailService } from './services/mail.service';
import { Inquiry } from '../../entities/inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  controllers: [InquiriesController],
  providers: [InquiriesService, MailService],
  exports: [InquiriesService, MailService],
})
export class InquiriesModule {}
