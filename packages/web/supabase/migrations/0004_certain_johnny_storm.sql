CREATE TABLE "public_quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quest_id" uuid NOT NULL,
	"family_quest_id" uuid NOT NULL,
	"is_shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "public_quests_quest_id_unique" UNIQUE("quest_id")
);
--> statement-breakpoint
ALTER TABLE "template_quests" ADD COLUMN "family_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "template_quests" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "template_quests" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "public_quests" ADD CONSTRAINT "public_quests_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_quests" ADD CONSTRAINT "public_quests_family_quest_id_family_quests_id_fk" FOREIGN KEY ("family_quest_id") REFERENCES "public"."family_quests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_quests" ADD CONSTRAINT "template_quests_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;