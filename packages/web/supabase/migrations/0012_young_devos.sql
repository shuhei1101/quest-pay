ALTER TABLE "quest_children" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "quest_children" ALTER COLUMN "status" SET DEFAULT 'not_started'::text;--> statement-breakpoint
DROP TYPE "public"."child_quest_status";--> statement-breakpoint
CREATE TYPE "public"."child_quest_status" AS ENUM('not_started', 'in_progress', 'pending_review', 'completed');--> statement-breakpoint
ALTER TABLE "quest_children" ALTER COLUMN "status" SET DEFAULT 'not_started'::"public"."child_quest_status";--> statement-breakpoint
ALTER TABLE "quest_children" ALTER COLUMN "status" SET DATA TYPE "public"."child_quest_status" USING "status"::"public"."child_quest_status";