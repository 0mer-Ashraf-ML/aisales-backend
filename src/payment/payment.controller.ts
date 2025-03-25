import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Customer Endpoints
  @Post('create-customer')
  async createCustomer(
    @Body() body: { name: string; email: string; contact: string },
  ) {
    return this.paymentService.createCustomer(
      body.name,
      body.email,
      body.contact,
    );
  }

  @Get('customer/:id')
  async getCustomer(@Param('id') id: string) {
    return this.paymentService.retrieveCustomer(id);
  }

  @Put('customer/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateData: Partial<Stripe.CustomerUpdateParams>,
  ) {
    return this.paymentService.updateCustomer(id, updateData);
  }

  @Delete('customer/:id')
  async deleteCustomer(@Param('id') id: string) {
    return this.paymentService.deleteCustomer(id);
  }

  // Payment Intent Endpoints
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string; customerId?: string },
  ) {
    return this.paymentService.createPaymentIntent(
      body.amount,
      body.currency,
      body.customerId,
    );
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    return this.paymentService.retrievePaymentIntent(id);
  }

  @Post('confirm-payment-intent')
  async confirmPaymentIntent(
    @Body() body: { intentId: string; paymentMethodId: string },
  ) {
    return this.paymentService.confirmPaymentIntent(
      body.intentId,
      body.paymentMethodId,
    );
  }

  @Post('cancel-payment-intent/:id')
  async cancelPaymentIntent(@Param('id') id: string) {
    return this.paymentService.cancelPaymentIntent(id);
  }

  // Payment Endpoints
  @Get('payments')
  async listPayments(@Query('limit') limit = 10) {
    return this.paymentService.listPayments(limit);
  }

  @Get('payment/:id')
  async getPayment(@Param('id') id: string) {
    return this.paymentService.retrievePayment(id);
  }

  @Post('refund-payment')
  async refundPayment(@Body() body: { chargeId: string; amount?: number }) {
    return this.paymentService.refundPayment(body.chargeId, body.amount);
  }

  // Product Endpoints
  @Post('create-product')
  async createProduct(
    @Body()
    body: {
      name: string;
      description?: string;
      metadata?: Stripe.MetadataParam;
    },
  ) {
    return this.paymentService.createProduct(
      body.name,
      body.description,
      body.metadata,
    );
  }

  @Get('product/:id')
  async getProduct(@Param('id') id: string) {
    return this.paymentService.retrieveProduct(id);
  }

  @Put('product/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: Stripe.ProductUpdateParams,
  ) {
    return this.paymentService.updateProduct(id, updateData);
  }

  @Get('products')
  async listProducts(
    @Query('limit') limit = 10,
    @Query('active') active?: boolean,
  ) {
    return this.paymentService.listProducts(limit, active);
  }

  // Price Endpoints
  @Post('create-price')
  async createPrice(
    @Body()
    body: {
      productId: string;
      unitAmount: number;
      currency: string;
      recurring?: Stripe.PriceCreateParams.Recurring;
    },
  ) {
    return this.paymentService.createPrice(
      body.productId,
      body.unitAmount,
      body.currency,
      body.recurring,
    );
  }

  @Get('price/:id')
  async getPrice(@Param('id') id: string) {
    return this.paymentService.retrievePrice(id);
  }

  @Put('price/:id')
  async updatePrice(
    @Param('id') id: string,
    @Body() updateData: Stripe.PriceUpdateParams,
  ) {
    return this.paymentService.updatePrice(id, updateData);
  }

  @Get('prices')
  async listPrices(
    @Query('limit') limit = 10,
    @Query('active') active?: boolean,
    @Query('productId') productId?: string,
  ) {
    return this.paymentService.listPrices(limit, active, productId);
  }

  // Subscription Endpoints
  @Post('create-subscription')
  async createSubscription(
    @Body()
    body: {
      customerId: string;
      priceId: string;
      paymentMethodId?: string;
      metadata?: Stripe.MetadataParam;
      trialPeriodDays?: number;
    },
  ) {
    return this.paymentService.createSubscription(
      body.customerId,
      body.priceId,
      body.paymentMethodId,
      body.metadata,
      body.trialPeriodDays,
    );
  }

  @Get('subscription/:id')
  async getSubscription(@Param('id') id: string) {
    return this.paymentService.retrieveSubscription(id);
  }

  @Put('subscription/:id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateData: Stripe.SubscriptionUpdateParams,
  ) {
    return this.paymentService.updateSubscription(id, updateData);
  }

  @Post('cancel-subscription/:id')
  async cancelSubscription(
    @Param('id') id: string,
    @Body() body: { cancelAtPeriodEnd?: boolean },
  ) {
    return this.paymentService.cancelSubscription(
      id,
      body.cancelAtPeriodEnd || false,
    );
  }

  @Get('subscriptions')
  async listSubscriptions(
    @Query('customerId') customerId?: string,
    @Query('limit') limit = 10,
    @Query('status') status?: Stripe.Subscription.Status,
  ) {
    return this.paymentService.listSubscriptions(customerId, limit, status);
  }

  // Subscription Item Endpoints
  @Post('add-subscription-item')
  async addSubscriptionItem(
    @Body()
    body: {
      subscriptionId: string;
      priceId: string;
      quantity?: number;
    },
  ) {
    return this.paymentService.addSubscriptionItem(
      body.subscriptionId,
      body.priceId,
      body.quantity,
    );
  }

  @Put('subscription-item/:id')
  async updateSubscriptionItem(
    @Param('id') id: string,
    @Body() updateData: Stripe.SubscriptionItemUpdateParams,
  ) {
    return this.paymentService.updateSubscriptionItem(id, updateData);
  }

  @Delete('subscription-item/:id')
  async removeSubscriptionItem(@Param('id') id: string) {
    return this.paymentService.removeSubscriptionItem(id);
  }

  // Subscription Schedule Endpoints
  @Post('create-subscription-schedule')
  async createSubscriptionSchedule(
    @Body()
    body: {
      customerId: string;
      phases: Array<Stripe.SubscriptionScheduleCreateParams.Phase>;
    },
  ) {
    return this.paymentService.createSubscriptionSchedule(
      body.customerId,
      body.phases,
    );
  }

  @Get('subscription-schedule/:id')
  async getSubscriptionSchedule(@Param('id') id: string) {
    return this.paymentService.retrieveSubscriptionSchedule(id);
  }

  @Put('subscription-schedule/:id')
  async updateSubscriptionSchedule(
    @Param('id') id: string,
    @Body() updateData: Stripe.SubscriptionScheduleUpdateParams,
  ) {
    return this.paymentService.updateSubscriptionSchedule(id, updateData);
  }

  @Post('cancel-subscription-schedule/:id')
  async cancelSubscriptionSchedule(@Param('id') id: string) {
    return this.paymentService.cancelSubscriptionSchedule(id);
  }

  // Payment Method Endpoints
  @Post('attach-payment-method')
  async attachPaymentMethod(
    @Body() body: { paymentMethodId: string; customerId: string },
  ) {
    return this.paymentService.attachPaymentMethod(
      body.paymentMethodId,
      body.customerId,
    );
  }

  @Post('detach-payment-method/:id')
  async detachPaymentMethod(@Param('id') id: string) {
    return this.paymentService.detachPaymentMethod(id);
  }

  @Get('payment-methods')
  async listCustomerPaymentMethods(
    @Query('customerId') customerId: string,
    @Query('type') type: Stripe.PaymentMethodListParams.Type = 'card',
    @Query('limit') limit = 10,
  ) {
    return this.paymentService.listCustomerPaymentMethods(
      customerId,
      type,
      limit,
    );
  }

  // Invoice Endpoints
  @Get('invoice/:id')
  async getInvoice(@Param('id') id: string) {
    return this.paymentService.retrieveInvoice(id);
  }

  @Get('invoices')
  async listInvoices(
    @Query('customerId') customerId?: string,
    @Query('limit') limit = 10,
    @Query('status') status?: Stripe.Invoice.Status,
    @Query('subscription') subscription?: string,
  ) {
    return this.paymentService.listInvoices(
      customerId,
      limit,
      status,
      subscription,
    );
  }

  // Webhook Endpoint
  @Post('webhook')
  async handleWebhook(
    @Body() payload: Buffer,
    @Query('signature') signature: string,
    @Query('webhookSecret') webhookSecret: string,
  ) {
    const event = await this.paymentService.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    // Process the event based on its type
    // This is just an example - you would implement your own event handling logic
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'invoice.payment_succeeded':
        // Handle successful subscription payment
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
      // Add more event types as needed
    }

    return { received: true };
  }
}
