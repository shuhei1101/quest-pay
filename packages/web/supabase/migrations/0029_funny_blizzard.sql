CREATE TYPE "public"."timeline_type" AS ENUM('quest_registered', 'quest_received', 'quest_completed', 'quest_level_up', 'penalty_received', 'quest_published', 'quest_like_milestone', 'child_birthday', 'other');--> statement-breakpoint
ALTER TABLE "family_timeline" RENAME COLUMN "action_type" TO "type";--> statement-breakpoint
ALTER TABLE "public_timeline" RENAME COLUMN "action_type" TO "type";