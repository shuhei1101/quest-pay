CREATE TABLE "template_quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quest_id" uuid NOT NULL,
	CONSTRAINT "template_quests_quest_id_unique" UNIQUE("quest_id")
);
--> statement-breakpoint
ALTER TABLE "quest_details" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "quest_tags" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "template_quests" ADD CONSTRAINT "template_quests_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE restrict ON UPDATE no action;