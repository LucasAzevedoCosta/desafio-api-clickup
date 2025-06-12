ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."status_enum";--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('to do', 'in progress', 'complete');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "public"."status_enum" USING "status"::"public"."status_enum";