CREATE TYPE "public"."status_enum" AS ENUM('to do', 'in progress', 'completed');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "public"."status_enum" USING "status"::"public"."status_enum";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "title" text NOT NULL;