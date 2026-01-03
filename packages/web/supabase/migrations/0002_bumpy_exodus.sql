CREATE TYPE "public"."child_quest_status" AS ENUM('not_started', 'in_progress', 'reporting', 'completed');--> statement-breakpoint
ALTER TABLE "quest_children" ADD COLUMN "status" "child_quest_status" DEFAULT 'not_started' NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_children" ADD COLUMN "status_updated_at" timestamp with time zone;