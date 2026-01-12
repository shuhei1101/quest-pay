CREATE TYPE "public"."notification_type" AS ENUM('family_quest_review', 'other');--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" "notification_type" DEFAULT 'other' NOT NULL;