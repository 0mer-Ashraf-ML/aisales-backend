import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRole1745937197311 implements MigrationInterface {
  name = 'UpdateRole1745937197311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "users"
      SET "role" = '1'
      WHERE "email" = 'hagard@yopmail.com'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "users"
      SET "role" = '3'
      WHERE "email" = 'hagard@yopmail.com'
    `);
  }
}
