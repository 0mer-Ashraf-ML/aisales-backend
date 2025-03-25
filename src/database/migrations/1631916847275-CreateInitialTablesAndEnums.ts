import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateInitialTablesAndEnums1631916847275
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create uuid-ossp extension first
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create enum for subscription status
    await queryRunner.query(`
      CREATE TYPE subscription_status_enum AS ENUM (
        'trial', 
        'active', 
        'expired', 
        'cancelled'
      )
    `);

    // Create enum for payment methods
    await queryRunner.query(`
      CREATE TYPE payment_method_enum AS ENUM (
        'apple_pay',
        'google_pay',
        'stripe',
        'paypal'
      )
    `);

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
          },
          {
            name: 'full_name',
            type: 'varchar',
          },
          {
            name: 'profile_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'stripe_customer_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'preferences',
            type: 'jsonb',
            isNullable: true,
            default: `'{"theme": "light", "notifications": true}'::jsonb`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'last_login',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create subscriptions table
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'subscription_status_enum',
            default: `'trial'`,
          },
          {
            name: 'trial_start_date',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'trial_end_date',
            type: 'timestamp',
            default: `NOW() + interval '7 days'`,
          },
          {
            name: 'subscription_start_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'subscription_end_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    // Create payments table
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'subscription_id',
            type: 'uuid',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: `'USD'`,
          },
          {
            name: 'payment_method',
            type: 'payment_method_enum',
          },
          {
            name: 'payment_reference',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'pending'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    // Create push_notifications table
    await queryRunner.createTable(
      new Table({
        name: 'push_notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'body',
            type: 'text',
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'read_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create device_tokens table for push notifications
    await queryRunner.createTable(
      new Table({
        name: 'device_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'device_token',
            type: 'varchar',
          },
          {
            name: 'device_type',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    // Foreign key for subscriptions.user_id
    await queryRunner.createForeignKey(
      'subscriptions',
      new TableForeignKey({
        name: 'FK_SUBSCRIPTIONS_USER_ID',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key for payments.user_id and payments.subscription_id
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        name: 'FK_PAYMENTS_USER_ID',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        name: 'FK_PAYMENTS_SUBSCRIPTION_ID',
        columnNames: ['subscription_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'subscriptions',
        onDelete: 'CASCADE',
      }),
    );
    // Foreign key for push_notifications.user_id
    await queryRunner.createForeignKey(
      'push_notifications',
      new TableForeignKey({
        name: 'FK_PUSH_NOTIFICATIONS_USER_ID',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key for device_tokens.user_id
    await queryRunner.createForeignKey(
      'device_tokens',
      new TableForeignKey({
        name: 'FK_DEVICE_TOKENS_USER_ID',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // ---- Create Indexes ----

    // Indexes for users table
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );

    // Indexes for subscriptions table
    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_STATUS',
        columnNames: ['status'],
      }),
    );

    // Index for device_tokens table
    await queryRunner.createIndex(
      'device_tokens',
      new TableIndex({
        name: 'IDX_DEVICE_TOKENS_USER_ID',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('device_tokens', 'IDX_DEVICE_TOKENS_USER_ID');
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_STATUS');
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_USER_ID');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    // Drop foreign keys
    await queryRunner.dropForeignKey(
      'device_tokens',
      'FK_DEVICE_TOKENS_USER_ID',
    );
    await queryRunner.dropForeignKey(
      'push_notifications',
      'FK_PUSH_NOTIFICATIONS_USER_ID',
    );
    await queryRunner.dropForeignKey('payments', 'FK_PAYMENTS_SUBSCRIPTION_ID');
    await queryRunner.dropForeignKey('payments', 'FK_PAYMENTS_USER_ID');
    await queryRunner.dropForeignKey(
      'subscriptions',
      'FK_SUBSCRIPTIONS_USER_ID',
    );

    // Drop tables
    await queryRunner.dropTable('device_tokens');
    await queryRunner.dropTable('push_notifications');
    await queryRunner.dropTable('announcements');
    await queryRunner.dropTable('payments');
    await queryRunner.dropTable('subscriptions');
    await queryRunner.dropTable('users');

    // Drop enum types
    await queryRunner.query(`DROP TYPE payment_method_enum`);
    await queryRunner.query(`DROP TYPE subscription_status_enum`);
  }
}
