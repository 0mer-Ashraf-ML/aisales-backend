import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateUserTable1744366706497 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_verified',
        type: 'boolean',
        isNullable: false,
        default: 'false', // Should be a string for SQL compatibility
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_verified');
  }

}
