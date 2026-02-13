ALTER TABLE "quest_details" ALTER COLUMN "required_clear_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "quest_details" ALTER COLUMN "required_clear_count" DROP NOT NULL;