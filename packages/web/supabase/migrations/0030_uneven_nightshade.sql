ALTER TABLE "family_timeline" ALTER COLUMN "url" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "family_timeline" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "public_timeline" ALTER COLUMN "url" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "public_timeline" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "family_timeline" DROP COLUMN "target_table";--> statement-breakpoint
ALTER TABLE "family_timeline" DROP COLUMN "target_id";--> statement-breakpoint
ALTER TABLE "public_timeline" DROP COLUMN "target_table";--> statement-breakpoint
ALTER TABLE "public_timeline" DROP COLUMN "target_id";