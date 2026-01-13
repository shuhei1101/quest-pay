ALTER TABLE "quest_children" ADD COLUMN "current_clear_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_children" ADD COLUMN "is_activate" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_children" DROP COLUMN "response_message";