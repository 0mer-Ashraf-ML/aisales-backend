import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entity/subscription.entity';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { NotificationsService } from '@src/notifications/notifications.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const exists = await this.subscriptionRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('This email is already subscribed.');
    }

    const subscription = this.subscriptionRepo.create(dto);
    const savedSubscription = await this.subscriptionRepo.save(subscription);

    // ✅ Send subscription confirmation email
    await this.notificationsService.sendSubscriptionConfirmation(dto.email);

    return savedSubscription;
  }
}
