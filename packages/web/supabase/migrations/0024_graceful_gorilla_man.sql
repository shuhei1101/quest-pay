CREATE TYPE "public"."age_reward_table_type" AS ENUM('template', 'public', 'family', 'child');--> statement-breakpoint
CREATE TYPE "public"."level_reward_table_type" AS ENUM('template', 'public', 'family', 'child');--> statement-breakpoint
CREATE TABLE "child_age_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "child_level_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_age_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_level_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_age_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_age_reward_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"is_activate" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_level_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_level_reward_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"is_activate" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reward_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "age_reward_table_type" DEFAULT 'template' NOT NULL,
	"age_reward_table_id" uuid NOT NULL,
	"age" integer NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reward_by_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "level_reward_table_type" DEFAULT 'template' NOT NULL,
	"level_reward_table_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_age_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_age_reward_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_level_reward_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_level_reward_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "child_age_reward_tables" ADD CONSTRAINT "child_age_reward_tables_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_level_reward_tables" ADD CONSTRAINT "child_level_reward_tables_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_age_reward_tables" ADD CONSTRAINT "family_age_reward_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_level_reward_tables" ADD CONSTRAINT "family_level_reward_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_age_reward_tables" ADD CONSTRAINT "public_age_reward_tables_family_age_reward_table_id_family_age_reward_tables_id_fk" FOREIGN KEY ("family_age_reward_table_id") REFERENCES "public"."family_age_reward_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_age_reward_tables" ADD CONSTRAINT "public_age_reward_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_level_reward_tables" ADD CONSTRAINT "public_level_reward_tables_family_level_reward_table_id_family_level_reward_tables_id_fk" FOREIGN KEY ("family_level_reward_table_id") REFERENCES "public"."family_level_reward_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_level_reward_tables" ADD CONSTRAINT "public_level_reward_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_age_reward_tables" ADD CONSTRAINT "template_age_reward_tables_public_age_reward_table_id_public_age_reward_tables_id_fk" FOREIGN KEY ("public_age_reward_table_id") REFERENCES "public"."public_age_reward_tables"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_age_reward_tables" ADD CONSTRAINT "template_age_reward_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_level_reward_tables" ADD CONSTRAINT "template_level_reward_tables_public_level_reward_table_id_public_level_reward_tables_id_fk" FOREIGN KEY ("public_level_reward_table_id") REFERENCES "public"."public_level_reward_tables"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_level_reward_tables" ADD CONSTRAINT "template_level_reward_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;