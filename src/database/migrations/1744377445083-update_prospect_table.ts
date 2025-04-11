import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProspectTable1744377445083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE prospects 
            ALTER COLUMN annual_revenue TYPE bigint
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE prospects 
            ALTER COLUMN annual_revenue TYPE integer
        `);
    }

}
