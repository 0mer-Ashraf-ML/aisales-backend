import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import mustache from 'mustache';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/EmailTemplates.entity';
import { IResponse } from '@src/common/interfaces';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private BREVO_COMPANY_NAME = process.env.BREVO_COMPANY_NAME || 'SellersGPT';
  private BREVO_EMAIL = process.env.BREVO_EMAIL || 'info@salebrate.com';
  private BREVO_SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN || 'baq.ai';
  private BREVO_SMTP_PASSWORD =
    process.env.BREVO_SMTP_PASSWORD || '09ff835eabc8881ed1137f92cdb85b4f';
  private BREVO_SMTP_HOST =
    process.env.BREVO_SMTP_HOST || 'smtp2.sendcloud.net';
  private BREVO_SMTP_PORT = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);

  private readonly transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(EmailTemplate)
    private readonly templateRepo: Repository<EmailTemplate>,
  ) {
    // Configure SMTP transporter with new server settings
    this.transporter = nodemailer.createTransport({
      host: this.BREVO_SMTP_HOST,
      port: this.BREVO_SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.BREVO_SMTP_LOGIN,
        pass: this.BREVO_SMTP_PASSWORD,
      },
    });

    // Verify transporter configuration on service initialization
    this.verifyTransporterConnection();
  }

  /**
   * Verify the SMTP transporter connection when the service initializes
   */
  private async verifyTransporterConnection() {
    try {
      const verification = await this.transporter.verify();
      this.logger.log(`✅ SMTP connection verified: ${verification}`);
    } catch (error) {
      this.logger.error('❌ Failed to verify SMTP connection:', error);
    }
  }

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
      this.logger.error(`Error fetching template for ${emailType}:`, error);
      throw new NotFoundException(
        `Failed to load email template: ${emailType}`,
      );
    }

    const emailBody = {
      ...body,
      current_year: new Date().getFullYear().toString(),
    };

    const htmlContent = mustache.render(htmlTemplate, emailBody);

    const mailOptions = {
      from: `"${this.BREVO_COMPANY_NAME}" <${this.BREVO_EMAIL}>`,
      to: recipientEmail,
      subject: template?.subject,
      html: htmlContent,
      replyTo: this.BREVO_EMAIL,
    };

    try {
      const response = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email sent: ${emailType} to ${recipientEmail}`);
      return response;
    } catch (error) {
      this.logger.error(
        `❌ Error Sending Email: ${emailType} to ${recipientEmail}`,
        error,
      );
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Test email function for verifying Brevo configuration
   * Adds additional logging and provides detailed response
   */
  async sendTestEmail(
    emailType: string,
    body: any,
    recipientEmail: string,
  ): Promise<IResponse> {
    this.logger.log(`Starting test email: ${emailType} to ${recipientEmail}`);
    this.logger.log(
      `Using SMTP: ${this.BREVO_SMTP_HOST}:${this.BREVO_SMTP_PORT}`,
    );

    try {
      // Test transporter connection first
      const verificationResult = await this.transporter.verify();
      this.logger.log(`SMTP connection test result: ${verificationResult}`);

      // Then attempt to send the actual email
      const response = await this.sendEmail(emailType, body, recipientEmail);

      return {
        data: {
          smtpVerification: verificationResult,
          emailSent: true,
          messageId: response.messageId,
          response: response.response,
          transporterConfig: {
            host: this.BREVO_SMTP_HOST,
            port: this.BREVO_SMTP_PORT,
            user: this.BREVO_SMTP_LOGIN,
            // Don't include password in logs for security
          },
        },
      };
    } catch (error) {
      this.logger.error(`Test email failed:`, error);

      // Provide more diagnostic information in the error
      throw new InternalServerErrorException({
        message: 'Test email sending failed',
        transporterConfig: {
          host: this.BREVO_SMTP_HOST,
          port: this.BREVO_SMTP_PORT,
          user: this.BREVO_SMTP_LOGIN,
        },
        error: error.message,
      });
    }
  }
}
