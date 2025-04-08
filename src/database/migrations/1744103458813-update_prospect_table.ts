import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProspectTable1744103458813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter existing columns to make them nullable
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN country DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN company_name DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN company_website DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN industry DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN num_employees DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN annual_revenue DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN name DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN title DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN recommended_email DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN emails DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN phones DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN company_keyword DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN linkedin_url DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes (make columns NOT NULL again)
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN country SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN company_name SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN company_website SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN industry SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN num_employees SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN annual_revenue SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN name SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN title SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN recommended_email SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN emails SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN phones SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN company_keyword SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE prospects ALTER COLUMN linkedin_url SET NOT NULL`,
    );
  }
}
