import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSuspendedFieldToUser1745938000000 implements MigrationInterface {
  name = 'AddIsSuspendedFieldToUser1745938000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "isSuspended" boolean NOT NULL DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "isSuspended";
    `);
  }
}
