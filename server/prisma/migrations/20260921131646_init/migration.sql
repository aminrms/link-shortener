-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "short_link" DROP NOT NULL,
ALTER COLUMN "short_link" DROP DEFAULT;
