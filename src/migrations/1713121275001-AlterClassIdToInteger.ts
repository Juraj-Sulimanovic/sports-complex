import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClassIdToInteger1713121275001 implements MigrationInterface {
  name = 'AlterClassIdToInteger1713121275001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create a temporary column to store the new ID
    await queryRunner.query(`
      ALTER TABLE "classes" 
      ADD COLUMN "new_id" SERIAL NOT NULL
    `);

    // Update the new_id column with sequential numbers
    await queryRunner.query(`
      UPDATE "classes" 
      SET "new_id" = nextval('classes_new_id_seq')
    `);

    // Drop the old primary key constraint
    await queryRunner.query(`
      ALTER TABLE "classes" 
      DROP CONSTRAINT "PK_9c0e1327c9a3a1b5b0c0e1327c9"
    `);

    // Drop the old id column
    await queryRunner.query(`
      ALTER TABLE "classes" 
      DROP COLUMN "id"
    `);

    // Rename new_id to id
    await queryRunner.query(`
      ALTER TABLE "classes" 
      RENAME COLUMN "new_id" TO "id"
    `);

    // Add the new primary key constraint
    await queryRunner.query(`
      ALTER TABLE "classes" 
      ADD CONSTRAINT "PK_classes" PRIMARY KEY ("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Create a temporary column to store the UUID
    await queryRunner.query(`
      ALTER TABLE "classes" 
      ADD COLUMN "old_id" uuid NOT NULL DEFAULT uuid_generate_v4()
    `);

    // Drop the primary key constraint
    await queryRunner.query(`
      ALTER TABLE "classes" 
      DROP CONSTRAINT "PK_classes"
    `);

    // Drop the integer id column
    await queryRunner.query(`
      ALTER TABLE "classes" 
      DROP COLUMN "id"
    `);

    // Rename old_id to id
    await queryRunner.query(`
      ALTER TABLE "classes" 
      RENAME COLUMN "old_id" TO "id"
    `);

    // Add the primary key constraint back
    await queryRunner.query(`
      ALTER TABLE "classes" 
      ADD CONSTRAINT "PK_9c0e1327c9a3a1b5b0c0e1327c9" PRIMARY KEY ("id")
    `);
  }
} 