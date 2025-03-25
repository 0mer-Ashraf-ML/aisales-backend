import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmailTemplates1742308734982 implements MigrationInterface {
  name = 'CreateEmailTemplates1742308734982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'EmailTemplates',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'subject',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'text', // To store very long text content
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('EmailTemplates');
  }
}
