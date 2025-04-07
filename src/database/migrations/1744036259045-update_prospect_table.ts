import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateProspectTable1744036259045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'prospects',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('prospects', 'user_id');
  }
}
