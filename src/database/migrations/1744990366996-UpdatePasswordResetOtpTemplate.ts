import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePasswordResetOtpTemplate1744990366996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "EmailTemplates"
      SET
        "name" = 'PASSWORD_RESET_OTP',
        "subject" = 'Password Reset OTP',
        "body" = $$<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
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
    .otp-container {
      margin: 25px 0;
      text-align: center;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      background-color: #f0f4ff;
      color: #4c6ef5;
      padding: 15px 20px;
      border-radius: 6px;
      display: inline-block;
    }
    .button {
      display: block;
      width: 200px;
      margin: 30px auto;
      padding: 12px 24px;
      background-color: #4c6ef5;
      color: #ffffff;
      text-decoration: none;
      text-align: center;
      border-radius: 4px;
      font-weight: 600;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .expiry {
      margin: 20px 0;
      padding: 10px;
      background-color: #fff8e6;
      border-left: 4px solid #ffc107;
      font-size: 14px;
    }
    .help-text {
      margin-top: 20px;
      font-size: 14px;
      color: #666666;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #4c6ef5;
      text-decoration: none;
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
      <img src="https://www.sellersgpt.com/shared/logo/logo-light.png" alt="SellersGPT Logo" style="max-width: 100%; height: auto;" />
    </div>
    <div class="content">
      <h2>Reset Account Password</h2>
      <p>Hello {{name}},</p>
      <p>Please use the following One-Time Password (OTP) to reset your account password:</p>
      <div class="otp-container">
        <div class="otp-code">{{otp}}</div>
      </div>
      <div class="expiry">
        <strong>Note:</strong> This OTP will expire in 10 minutes for security reasons.
      </div>
      <p>If you didn't request this verification, please ignore this email or contact our support team if you have concerns.</p>
      <a href="{{verification_link}}" class="button">Reset Password</a>
      <div class="help-text">
        <p>Having trouble? If the OTP doesn't work, you can:</p>
        <ul>
          <li>Request a new code from the login page</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
      <div class="social-links">
        <a href="#">Facebook</a> |
        <a href="#">Twitter</a> |
        <a href="#">Instagram</a>
      </div>
      <p>&copy; 2025 SellersGPT. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
</html>$$,
        "updated_at" = NOW()
      WHERE "id" = 2
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "EmailTemplates" WHERE id = 2
    `);
  }
}
