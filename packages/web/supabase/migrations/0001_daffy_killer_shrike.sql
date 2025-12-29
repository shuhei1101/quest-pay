ALTER TABLE "profiles" ALTER COLUMN "family_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_tags" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;