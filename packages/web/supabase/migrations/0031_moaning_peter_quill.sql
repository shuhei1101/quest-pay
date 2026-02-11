CREATE TYPE "public"."reward_type" AS ENUM('quest', 'age_monthly', 'level_up', 'manual_adjustment');--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_family_id" uuid NOT NULL,
	"follow_family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reward_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"type" "reward_type" NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"amount" integer NOT NULL,
	"exp" integer DEFAULT 0 NOT NULL,
	"rewarded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scheduled_payment_date" date,
	"is_paid" boolean DEFAULT false NOT NULL,
	"paid_at" timestamp with time zone,
	"url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_family_id_families_id_fk" FOREIGN KEY ("follower_family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follow_family_id_families_id_fk" FOREIGN KEY ("follow_family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_histories" ADD CONSTRAINT "reward_histories_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;
