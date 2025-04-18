import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class  CreateSessionTableAndUpdateCompany1744990366995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create session table
  
      // 2. Add session_id column to company table
      await queryRunner.addColumn(
        "companies",
        new TableColumn({
          name: "session_id",
          type: "varchar",
          isNullable: true, // Optional: adjust based on your requirements
        })
      );
  
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop session_id column from company
    await queryRunner.dropColumn("companies", "session_id");

  }

}
