ALTER TABLE "family_timeline" ALTER COLUMN "action_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."family_timeline_action_type";--> statement-breakpoint
CREATE TYPE "public"."family_timeline_action_type" AS ENUM('quest_created', 'quest_completed', 'quest_cleared', 'quest_level_up', 'child_joined', 'parent_joined', 'reward_received', 'savings_updated', 'savings_milestone_reached', 'quest_milestone_reached', 'comment_posted', 'other');--> statement-breakpoint
ALTER TABLE "family_timeline" ALTER COLUMN "action_type" SET DATA TYPE "public"."family_timeline_action_type" USING "action_type"::"public"."family_timeline_action_type";--> statement-breakpoint
ALTER TABLE "public_timeline" ALTER COLUMN "action_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."public_timeline_action_type";--> statement-breakpoint
CREATE TYPE "public"."public_timeline_action_type" AS ENUM('quest_published', 'likes_milestone_reached', 'posts_milestone_reached', 'comments_milestone_reached', 'comment_posted', 'like_received', 'other');--> statement-breakpoint
ALTER TABLE "public_timeline" ALTER COLUMN "action_type" SET DATA TYPE "public"."public_timeline_action_type" USING "action_type"::"public"."public_timeline_action_type";--> statement-breakpoint
ALTER TABLE "family_timeline" ADD COLUMN "url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "public_timeline" ADD COLUMN "url" text DEFAULT '' NOT NULL;--> statement-breakpoint
DROP TYPE "public"."timeline_action_type";