import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscriptionBody1755667789912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "EmailTemplates"
      SET body = $$<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Subscription Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-height: 60px;
        }
        .content {
            padding: 30px;
        }
        .content h2 {
            color: #9333EA;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #9333EA;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
                border-radius: 0;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <img src="https://www.sellersgpt.com/shared/logo/logo-light.png" alt="SellersGPT-logo" />
    </div>
    <div class="content">
        <h2>Thank You for Subscribing!</h2>
        <p>Hello,</p>
        <p>You've successfully subscribed to our updates. We'll keep you informed with the latest news and insights to help you boost your sales with AI-driven prospecting.</p>
        <div class="button-container">
            <a href="https://www.sellersgpt.com" class="button">Visit Our Website</a>
        </div>
    </div>
    <div class="footer">
        <p>This is an automated message. Please do not reply.</p>
        <p>&copy; 2025 SellersGPT All rights reserved.</p>
    </div>
</div>
</body>
</html>
$$
      WHERE id = 3;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Optional: restore previous body content if needed
  }
}
