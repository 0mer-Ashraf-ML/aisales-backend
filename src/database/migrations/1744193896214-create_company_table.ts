import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateCompanyTable1744193896214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add company_id column to prospects table
    await queryRunner.addColumn(
      'prospects',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
        isNullable: true, // Initially allow null to avoid issues with existing records
      }),
    );

    // Create companies table
    await queryRunner.query(`
        CREATE TABLE "companies" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "company_name" character varying NOT NULL,
          "dba" character varying,
          "products_services" text array,
          "buyer_industries" text array,
          "web_url" character varying,
          "target_region" text array,
          "target_industries" text array,
          "preferred_company_size" character varying,
          "preferred_contact_department" text array,
          "preferred_industry_keywords" text array,
          "tech_stack" text array,
          "user_id" uuid NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_companies" PRIMARY KEY ("id")
        )
      `);

    // Add foreign key from companies to users
    await queryRunner.query(`
        ALTER TABLE "companies" 
        ADD CONSTRAINT "FK_companies_users" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") 
        ON DELETE CASCADE
      `);

    // Add foreign key from prospects to companies
    await queryRunner.createForeignKey(
      'prospects',
      new TableForeignKey({
        name: 'FK_prospects_companies',
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL', // Use SET NULL during migration to avoid breaking existing data
      }),
    );

    // Now that data is migrated, make company_id required and keep user_id for reference
    // In a future migration you could consider removing user_id if no longer needed
    await queryRunner.changeColumn(
      'prospects',
      'company_id',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Update the on delete behavior for the foreign key
    await queryRunner.dropForeignKey('prospects', 'FK_prospects_companies');
    await queryRunner.createForeignKey(
      'prospects',
      new TableForeignKey({
        name: 'FK_prospects_companies',
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key
    await queryRunner.dropForeignKey('prospects', 'FK_prospects_companies');

    // Remove company_id column
    await queryRunner.dropColumn('prospects', 'company_id');

    // Drop companies table and its foreign key
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_companies_users"`,
    );
    await queryRunner.query(`DROP TABLE "companies"`);
  }
}
