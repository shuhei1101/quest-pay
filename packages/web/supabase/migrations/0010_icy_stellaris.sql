ALTER TABLE "quest_children" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_children" DROP COLUMN "current_level";