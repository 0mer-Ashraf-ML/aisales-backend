import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVerificationOtps1742310441154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create verification_otps table
    await queryRunner.query(`
        CREATE TABLE "verification_otps" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "user_id" uuid NOT NULL,
          "email" character varying(255) NOT NULL,
          "otp_code" character varying(6) NOT NULL,
          "type" character varying(50) NOT NULL,
          "expires_at" TIMESTAMP NOT NULL DEFAULT (now() + interval '10 minutes'),
          "verified" boolean NOT NULL DEFAULT false,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_verification_otps" PRIMARY KEY ("id")
        )
      `);

    // Create indexes
    await queryRunner.query(`
        CREATE INDEX "IDX_VERIFICATION_OTP_USER_ID" ON "verification_otps" ("user_id")
      `);

    await queryRunner.query(`
        CREATE INDEX "IDX_VERIFICATION_OTP_EMAIL_TYPE" ON "verification_otps" ("email", "type")
      `);

    await queryRunner.query(`
        CREATE INDEX "IDX_VERIFICATION_OTP_CODE" ON "verification_otps" ("otp_code")
      `);

    // Ensure uuid extension is available
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_VERIFICATION_OTP_CODE"`);
    await queryRunner.query(`DROP INDEX "IDX_VERIFICATION_OTP_EMAIL_TYPE"`);
    await queryRunner.query(`DROP INDEX "IDX_VERIFICATION_OTP_USER_ID"`);

    // Drop table
    await queryRunner.query(`DROP TABLE "verification_otps"`);
  }
}
