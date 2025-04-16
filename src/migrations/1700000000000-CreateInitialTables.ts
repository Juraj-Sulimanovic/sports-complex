import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "classes" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "sportType" VARCHAR NOT NULL,
        "description" VARCHAR NOT NULL,
        "maxParticipants" INTEGER NOT NULL,
        "startTime" TIME NOT NULL,
        "endTime" TIME NOT NULL,
        "weekDays" TEXT[] NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "enrollments" (
        "id" SERIAL PRIMARY KEY,
        "classId" INTEGER NOT NULL,
        "userId" INTEGER NOT NULL,
        "enrolledAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_enrollments_class" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_enrollments_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "enrollments";
      DROP TABLE IF EXISTS "classes";
      DROP TABLE IF EXISTS "users";
    `);
  }
}
