ALTER TABLE "public_quest_comments" ADD COLUMN "is_pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "comment_upvotes" DROP COLUMN "type";