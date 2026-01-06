ALTER TABLE "public_quests" DROP CONSTRAINT "public_quests_family_quest_id_family_quests_id_fk";
--> statement-breakpoint
ALTER TABLE "public_quests" ADD COLUMN "family_id" uuid;--> statement-breakpoint
ALTER TABLE "public_quests" ADD CONSTRAINT "public_quests_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_quests" ADD CONSTRAINT "public_quests_family_quest_id_family_quests_id_fk" FOREIGN KEY ("family_quest_id") REFERENCES "public"."family_quests"("id") ON DELETE no action ON UPDATE no action;