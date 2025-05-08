import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddContactFieldToUser1745937197312 implements MigrationInterface {
  name = 'AddPhoneAndCountryFieldsToUser1745937197312';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "contact" character varying;
    `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "contact";`);
  }
}