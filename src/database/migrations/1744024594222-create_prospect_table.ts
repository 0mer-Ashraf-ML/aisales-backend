import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProspectTable1744024594222 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          { name: 'country', type: 'varchar' },
          { name: 'company_name', type: 'varchar' },
          { name: 'company_website', type: 'varchar' },
          { name: 'industry', type: 'varchar' },
          { name: 'num_employees', type: 'int' },
          { name: 'annual_revenue', type: 'int' },
          { name: 'name', type: 'varchar' },
          { name: 'title', type: 'varchar' },
          { name: 'recommended_email', type: 'varchar' },
          { name: 'emails', type: 'text', isArray: true },
          { name: 'phones', type: 'text', isArray: true },
          { name: 'company_keyword', type: 'text', isArray: true },
          { name: 'linkedin_url', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prospects');
  }
}
