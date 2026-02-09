CREATE TYPE "public"."timeline_type" AS ENUM('quest_registered', 'quest_received', 'quest_completed', 'quest_level_up', 'penalty_received', 'quest_published', 'quest_like_milestone', 'child_birthday', 'other');--> statement-breakpoint
CREATE TABLE "family_timelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"type" timeline_type NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"quest_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_timelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"type" timeline_type NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"public_quest_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "family_timelines" ADD CONSTRAINT "family_timelines_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_timelines" ADD CONSTRAINT "family_timelines_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_timelines" ADD CONSTRAINT "family_timelines_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_timelines" ADD CONSTRAINT "public_timelines_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_timelines" ADD CONSTRAINT "public_timelines_public_quest_id_public_quests_id_fk" FOREIGN KEY ("public_quest_id") REFERENCES "public"."public_quests"("id") ON DELETE set null ON UPDATE no action;