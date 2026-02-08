CREATE TYPE "public"."family_timeline_action_type" AS ENUM('other', 'quest_created', 'quest_completed', 'quest_cleared', 'quest_level_up', 'child_joined', 'parent_joined', 'reward_received', 'savings_updated', 'comment_posted', 'like_received');--> statement-breakpoint
CREATE TYPE "public"."public_timeline_action_type" AS ENUM('other', 'quest_published', 'likes_milestone_reached', 'posts_milestone_reached', 'comments_milestone_reached');--> statement-breakpoint
ALTER TABLE "family_timeline" ALTER COLUMN "action_type" SET DATA TYPE "public"."family_timeline_action_type" USING "action_type"::text::"public"."family_timeline_action_type";--> statement-breakpoint
ALTER TABLE "public_timeline" ALTER COLUMN "action_type" SET DATA TYPE "public"."public_timeline_action_type" USING "action_type"::text::"public"."public_timeline_action_type";--> statement-breakpoint
DROP TYPE "public"."timeline_action_type";--> statement-breakpoint
CREATE TYPE "public"."timeline_action_type" AS ENUM('other');
