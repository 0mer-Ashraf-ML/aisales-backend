import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateIndustryPricingTable1742901988643
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'industry_pricing',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'industry',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'north_america',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'south_america',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'europe',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'asia',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'africa',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'middle_east',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'cis_russia',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'oceania',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Optional: Create a separate table for price change history
    await queryRunner.query(`
            CREATE TABLE industry_pricing_history (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              industry VARCHAR NOT NULL,
              region VARCHAR NOT NULL,
              old_price DECIMAL(6,2),
              new_price DECIMAL(6,2),
              changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('industry_pricing_history');
    await queryRunner.dropTable('industry_pricing');
  }
}
