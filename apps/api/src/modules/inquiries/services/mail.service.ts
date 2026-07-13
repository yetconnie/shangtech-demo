import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { Inquiry } from '../../../entities/inquiry.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  private getTransporter(): Transporter | null {
    if (this.transporter) {
      return this.transporter;
    }

    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass || host === 'smtp.example.com') {
      this.logger.warn('SMTP 未配置，跳过邮件发送');
      return null;
    }

    this.transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    return this.transporter;
  }

  async sendInquiryNotification(inquiry: Inquiry): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      return;
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@shangtech.com';
    const fromEmail = this.configService.get<string>('SMTP_USER') || 'no-reply@shangtech.com';

    const text = [
      '新的产品试用咨询已提交：',
      '',
      `姓名：${inquiry.name}`,
      `公司：${inquiry.company}`,
      `职位：${inquiry.position}`,
      `邮箱：${inquiry.email}`,
      `电话：${inquiry.phone || '未填写'}`,
      `感兴趣的产品：${inquiry.productInterest}`,
      `留言：${inquiry.message || '无'}`,
      '',
      `提交时间：${inquiry.createdAt.toISOString()}`,
      '',
      '请及时跟进处理。',
    ].join('\n');

    try {
      await transporter.sendMail({
        from: `ShangTech 官网 <${fromEmail}>`,
        to: adminEmail,
        subject: `新的产品试用咨询 - ${inquiry.company} ${inquiry.name}`,
        text,
      });
      this.logger.log(`询价通知邮件已发送至 ${adminEmail}`);
    } catch (error) {
      this.logger.error(
        `询价通知邮件发送失败：${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
