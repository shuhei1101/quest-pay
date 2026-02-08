--> statement-breakpoint
CREATE TYPE "public"."timeline_action_type" AS ENUM('quest_created', 'quest_completed', 'quest_cleared', 'quest_level_up', 'child_joined', 'parent_joined', 'reward_received', 'savings_updated');--> statement-breakpoint
CREATE TABLE "family_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"action_type" timeline_action_type NOT NULL,
	"target_table" text DEFAULT '' NOT NULL,
	"target_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"action_type" timeline_action_type NOT NULL,
	"target_table" text DEFAULT '' NOT NULL,
	"target_id" uuid NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "family_timeline" ADD CONSTRAINT "family_timeline_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_timeline" ADD CONSTRAINT "family_timeline_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_timeline" ADD CONSTRAINT "public_timeline_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;
