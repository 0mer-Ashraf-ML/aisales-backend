import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleColumn1745937197310 implements MigrationInterface {
  name = 'AddUserRoleColumn1745937197310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the "users_role_enum" type exists and contains numeric values
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
          CREATE TYPE "users_role_enum" AS ENUM ('1', '2', '3');  -- String-based numeric values
        END IF;
      END $$;
    `);

    // Step 1: Add the "role" column with the "users_role_enum" type
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "role" "users_role_enum" DEFAULT '3' 
    `);

    // Step 2: Update existing users with NULL roles to the default role '3' (User)
    await queryRunner.query(`
      UPDATE "users"
      SET "role" = '3'  
      WHERE "role" IS NULL
    `);

    // Optional: Set NOT NULL constraint if you want to enforce this column to never be NULL
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "role" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Remove the default value and NOT NULL constraints
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "role" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "role" DROP NOT NULL
    `);

    // Step 2: Drop the "role" column if we roll back this migration
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "role"
    `);
  }
}
