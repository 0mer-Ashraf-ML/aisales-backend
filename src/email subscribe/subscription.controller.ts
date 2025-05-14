import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Controller('emailsubscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.create(dto);
  }
}
