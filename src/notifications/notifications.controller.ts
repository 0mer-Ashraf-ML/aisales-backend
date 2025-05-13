import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

interface TestEmailDto {
  emailType: string;
  recipientEmail: string;
  data?: Record<string, any>;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-email')
  async testSendEmail(
    @Body()
    testEmailDto: {
      emailType: string;
      recipientEmail: string;
      data?: Record<string, any>;
    },
  ) {
    const { emailType, recipientEmail, data = {} } = testEmailDto;

    // Add some default test data if none is provided
    const testData = {
      userName: 'Test User',
      appName: 'SellersGPT',
      verificationLink: 'https://baq.ai/verify/test-link',
      ...data,
    };

    try {
      const result = await this.notificationsService.sendTestEmail(
        emailType,
        testData,
        recipientEmail,
      );
      return {
        success: true,
        message: 'Test email sent successfully',
        emailInfo: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.stack,
      };
    }
  }
}
