-- 年齢別お小遣い額テーブル（家族用）
CREATE TABLE "family_allowance_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"allowance_table_id" uuid NOT NULL,
	"age" integer NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

-- レベル別報酬額テーブル（家族用）
CREATE TABLE "family_level_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level_table_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

-- 外部キー制約
ALTER TABLE "family_allowance_by_ages" ADD CONSTRAINT "family_allowance_by_ages_allowance_table_id_family_allowance_tables_id_fk" FOREIGN KEY ("allowance_table_id") REFERENCES "public"."family_allowance_tables"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "family_level_rewards" ADD CONSTRAINT "family_level_rewards_level_table_id_family_level_tables_id_fk" FOREIGN KEY ("level_table_id") REFERENCES "public"."family_level_tables"("id") ON DELETE cascade ON UPDATE no action;
