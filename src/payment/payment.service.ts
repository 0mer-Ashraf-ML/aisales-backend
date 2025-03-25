import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces';
import { STRIPE_SECRET_KEY } from 'src/common/constants/constants';

import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  // Customer CRUD
  async createCustomer(
    name: string,
    email: string,
    phone: string,
  ): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.create({ name, email, phone });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateCustomer(
    customerId: string,
    updateData: Partial<Stripe.CustomerUpdateParams>,
  ): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.update(customerId, updateData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
    try {
      return await this.stripe.customers.del(customerId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Payment Intents
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method_types: ['card'], // Update as per your requirement
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrievePaymentIntent(intentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(intentId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async confirmPaymentIntent(
    intentId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(intentId, {
        payment_method: paymentMethodId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelPaymentIntent(intentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(intentId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Payments CRUD
  async listPayments(limit = 10): Promise<Stripe.ApiList<Stripe.Charge>> {
    try {
      return await this.stripe.charges.list({ limit });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrievePayment(paymentId: string): Promise<Stripe.Charge> {
    try {
      return await this.stripe.charges.retrieve(paymentId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async refundPayment(
    chargeId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.create({
        charge: chargeId,
        amount,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Products
  async createProduct(
    name: string,
    description?: string,
    metadata?: Stripe.MetadataParam,
  ): Promise<IResponse> {
    try {
      const data = await this.stripe.products.create({
        name,
        description,
        metadata,
      });
      return {
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrieveProduct(productId: string): Promise<Stripe.Product> {
    try {
      return await this.stripe.products.retrieve(productId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProduct(
    productId: string,
    updateData: Stripe.ProductUpdateParams,
  ): Promise<Stripe.Product> {
    try {
      return await this.stripe.products.update(productId, updateData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listProducts(
    limit = 10,
    active?: boolean,
  ): Promise<Stripe.ApiList<Stripe.Product>> {
    try {
      return await this.stripe.products.list({ limit, active });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Prices
  async createPrice(
    productId: string,
    unitAmount: number,
    currency: string,
    recurring?: Stripe.PriceCreateParams.Recurring,
  ): Promise<Stripe.Price> {
    try {
      return await this.stripe.prices.create({
        product: productId,
        unit_amount: unitAmount,
        currency,
        recurring,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrievePrice(priceId: string): Promise<Stripe.Price> {
    try {
      return await this.stripe.prices.retrieve(priceId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updatePrice(
    priceId: string,
    updateData: Stripe.PriceUpdateParams,
  ): Promise<Stripe.Price> {
    try {
      return await this.stripe.prices.update(priceId, updateData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listPrices(
    limit = 10,
    active?: boolean,
    productId?: string,
  ): Promise<Stripe.ApiList<Stripe.Price>> {
    try {
      return await this.stripe.prices.list({
        limit,
        active,
        product: productId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Subscriptions
  async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId?: string,
    metadata?: Stripe.MetadataParam,
    trialPeriodDays?: number,
  ): Promise<Stripe.Subscription> {
    try {
      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
      };

      if (paymentMethodId) {
        subscriptionData.default_payment_method = paymentMethodId;
      }

      if (trialPeriodDays) {
        subscriptionData.trial_period_days = trialPeriodDays;
      }

      return await this.stripe.subscriptions.create(subscriptionData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSubscription(
    subscriptionId: string,
    updateData: Stripe.SubscriptionUpdateParams,
  ): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, updateData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd = false,
  ): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listSubscriptions(
    customerId?: string,
    limit = 10,
    status?: Stripe.Subscription.Status,
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    try {
      return await this.stripe.subscriptions.list({
        customer: customerId,
        limit,
        status,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Subscription Items
  async addSubscriptionItem(
    subscriptionId: string,
    priceId: string,
    quantity = 1,
  ): Promise<Stripe.SubscriptionItem> {
    try {
      return await this.stripe.subscriptionItems.create({
        subscription: subscriptionId,
        price: priceId,
        quantity,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSubscriptionItem(
    subscriptionItemId: string,
    updateData: Stripe.SubscriptionItemUpdateParams,
  ): Promise<Stripe.SubscriptionItem> {
    try {
      return await this.stripe.subscriptionItems.update(
        subscriptionItemId,
        updateData,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeSubscriptionItem(
    subscriptionItemId: string,
  ): Promise<Stripe.DeletedSubscriptionItem> {
    try {
      return await this.stripe.subscriptionItems.del(subscriptionItemId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Subscription Schedules
  async createSubscriptionSchedule(
    customerId: string,
    phases: Array<Stripe.SubscriptionScheduleCreateParams.Phase>,
  ): Promise<Stripe.SubscriptionSchedule> {
    try {
      return await this.stripe.subscriptionSchedules.create({
        customer: customerId,
        phases,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async retrieveSubscriptionSchedule(
    scheduleId: string,
  ): Promise<Stripe.SubscriptionSchedule> {
    try {
      return await this.stripe.subscriptionSchedules.retrieve(scheduleId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSubscriptionSchedule(
    scheduleId: string,
    updateData: Stripe.SubscriptionScheduleUpdateParams,
  ): Promise<Stripe.SubscriptionSchedule> {
    try {
      return await this.stripe.subscriptionSchedules.update(
        scheduleId,
        updateData,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelSubscriptionSchedule(
    scheduleId: string,
  ): Promise<Stripe.SubscriptionSchedule> {
    try {
      return await this.stripe.subscriptionSchedules.cancel(scheduleId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Payment Methods
  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async detachPaymentMethod(
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listCustomerPaymentMethods(
    customerId: string,
    type: Stripe.PaymentMethodListParams.Type = 'card',
    limit = 10,
  ): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    try {
      return await this.stripe.paymentMethods.list({
        customer: customerId,
        type,
        limit,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Invoices
  async retrieveInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      return await this.stripe.invoices.retrieve(invoiceId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listInvoices(
    customerId?: string,
    limit = 10,
    status?: Stripe.Invoice.Status,
    subscription?: string,
  ): Promise<Stripe.ApiList<Stripe.Invoice>> {
    try {
      return await this.stripe.invoices.list({
        customer: customerId,
        limit,
        status,
        subscription,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Webhooks
  async constructEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string,
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
