CREATE TABLE "follows" (
	"follower_family_id" uuid NOT NULL,
	"follow_family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_family_id_families_id_fk" FOREIGN KEY ("follower_family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follow_family_id_families_id_fk" FOREIGN KEY ("follow_family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;