import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entity/subscription.entity';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const exists = await this.subscriptionRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('This email is already subscribed.');
    }

    const subscription = this.subscriptionRepo.create(dto);
    return this.subscriptionRepo.save(subscription);
  }
}
