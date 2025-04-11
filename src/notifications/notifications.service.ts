import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Mailgun from 'mailgun.js';
import mustache from 'mustache';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/EmailTemplates.entity';

@Injectable()
export class NotificationsService {
  private MAILGUN_SERVER =  'mg.digitalmentors.io';
  private MAILGUN_COMPANY_NAME =  'BaqAI';
  private MAILGUN_DOMAIN =  'mailgun@mg.digitalmentors.io';
  private MAILGUN_API_KEY =  '744c70e0cf9213ab0b169fe2b9682fd9-3d4b3a2a-6f8c4c06';

  private readonly mailgun = new Mailgun(FormData);
  private readonly client = this.mailgun.client({
    username: 'api',
    key: this.MAILGUN_API_KEY,
  });

  constructor(
    @InjectRepository(EmailTemplate)
    private readonly templateRepo: Repository<EmailTemplate>,
  ) {}

  /**
   * Generic function to send emails
   * @param emailType - Type of email (must match an entry in EMAIL_TEMPLATES)
   * @param body - Email body containing dynamic values
   * @param recipientEmail - Recipient's email address
   */
  async sendEmail(emailType: string, body: any, recipientEmail: string) {
    let htmlTemplate: string;
    let template = null;
    try {
      template = await this.templateRepo.findOne({
        where: { name: emailType },
      });

      if (!template) {
        throw new NotFoundException(
          `Email template for ${emailType} not found`,
        );
      }

      htmlTemplate = template?.body;
    } catch (error) {
      console.error(`Error fetching template for ${emailType}:`, error);
      throw new NotFoundException(
        `Failed to load email template: ${emailType}`,
      );
    }

    const emailBody = {
      ...body,
      current_year: new Date().getFullYear().toString(),
    };

    const htmlContent = mustache.render(htmlTemplate, emailBody);

    const messageData = {
      from: `${this.MAILGUN_COMPANY_NAME || 'Sambeel'} <${
        this.MAILGUN_DOMAIN
      }>`,
      to: recipientEmail,
      subject: template?.subject,
      html: htmlContent,
    };

    try {
      const response = await this.client.messages.create(
        this.MAILGUN_SERVER,
        messageData,
      );
      return response;
    } catch (error) {
      console.error(
        `❌ Error Sending Email: ${emailType} to ${recipientEmail}`,
        error,
      );
      throw new InternalServerErrorException(error);
    }
  }
}
