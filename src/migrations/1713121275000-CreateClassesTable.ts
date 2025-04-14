import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClassesTable1713121275000 implements MigrationInterface {
  name = 'CreateClassesTable1713121275000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."sport_type_enum" AS ENUM('baseball', 'basketball', 'football')
    `);

    await queryRunner.query(`
      CREATE TABLE "classes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "sportType" "public"."sport_type_enum" NOT NULL DEFAULT 'basketball',
        "description" character varying NOT NULL,
        "maxParticipants" integer NOT NULL,
        "startTime" TIME NOT NULL,
        "endTime" TIME NOT NULL,
        "weekDays" text array NOT NULL,
        "monthlyFee" decimal(10,2) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_9c0e1327c9a3a1b5b0c0e1327c9" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "classes"`);
    await queryRunner.query(`DROP TYPE "public"."sport_type_enum"`);
  }
} 