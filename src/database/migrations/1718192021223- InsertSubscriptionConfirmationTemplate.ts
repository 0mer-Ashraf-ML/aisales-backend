import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSubscriptionConfirmationTemplate1718192021223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "EmailTemplates" (
        "id",
        "name",
        "subject",
        "body",
        "created_at",
        "updated_at"
      )
      VALUES (
        3,
        'SUBSCRIPTION_CONFIRMATION',
        'You’re subscribed!',
        $$<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Subscription Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color: #4c6ef5;">🎉 You're Subscribed!</h2>
    <p>Hello {{name}},</p>
    <p>Thank you for subscribing to our updates. You’ll now be among the first to receive the latest news, product updates, and exclusive insights from SellersGPT.</p>
    <p>If you ever wish to unsubscribe, you can do so at any time from the footer of our emails.</p>
    <br />
    <p>Cheers,</p>
    <p>The SellersGPT Team</p>
  </div>
</body>
</html>$$,
        NOW(),
        NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "EmailTemplates" WHERE id = 3;
    `);
  }
}
