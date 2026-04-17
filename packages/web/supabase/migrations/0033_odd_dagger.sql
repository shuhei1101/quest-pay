CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'in_progress', 'completed', 'carried_over');--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'payment_pending' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'payment_completed' BEFORE 'other';--> statement-breakpoint
ALTER TABLE "quest_details" ALTER COLUMN "required_clear_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "quest_details" ALTER COLUMN "required_clear_count" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "is_pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "related_id" uuid;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD COLUMN "payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD COLUMN "payment_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD COLUMN "payment_started_by" uuid;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD COLUMN "completed_by" uuid;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD COLUMN "is_force_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD CONSTRAINT "reward_histories_payment_started_by_profiles_id_fk" FOREIGN KEY ("payment_started_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD CONSTRAINT "reward_histories_completed_by_profiles_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;