/*
  Warnings:

  - The values [user,ai] on the enum `ChatRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [react,next,node] on the enum `projectFrame` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatRole_new" AS ENUM ('USER', 'AI');
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "ChatRole_new" USING ("role"::text::"ChatRole_new");
ALTER TYPE "ChatRole" RENAME TO "ChatRole_old";
ALTER TYPE "ChatRole_new" RENAME TO "ChatRole";
DROP TYPE "ChatRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "projectFrame_new" AS ENUM ('REACT', 'NEXT', 'NODE');
ALTER TABLE "Project" ALTER COLUMN "framework" TYPE "projectFrame_new" USING ("framework"::text::"projectFrame_new");
ALTER TYPE "projectFrame" RENAME TO "projectFrame_old";
ALTER TYPE "projectFrame_new" RENAME TO "projectFrame";
DROP TYPE "projectFrame_old";
COMMIT;
