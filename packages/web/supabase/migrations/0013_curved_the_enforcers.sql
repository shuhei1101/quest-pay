ALTER TABLE "quest_children" ADD COLUMN "request_message" text;--> statement-breakpoint
ALTER TABLE "quest_children" ADD COLUMN "response_message" text;--> statement-breakpoint
ALTER TABLE "quest_children" ADD COLUMN "last_approved_by" uuid;--> statement-breakpoint
ALTER TABLE "quest_children" ADD CONSTRAINT "quest_children_last_approved_by_profiles_id_fk" FOREIGN KEY ("last_approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;