CREATE TYPE "public"."allowance_table_type" AS ENUM('template', 'public', 'family', 'child');--> statement-breakpoint
CREATE TYPE "public"."level_table_type" AS ENUM('template', 'public', 'family', 'child');--> statement-breakpoint
CREATE TABLE "child_allowance_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "child_level_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_allowance_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_level_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_allowance_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_allowance_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"is_activate" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_level_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_level_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"is_activate" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_allowance_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_allowance_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_level_by_ages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_level_table_id" uuid NOT NULL,
	"family_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "child_allowance_by_ages" ADD CONSTRAINT "child_allowance_by_ages_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_level_by_ages" ADD CONSTRAINT "child_level_by_ages_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_allowance_tables" ADD CONSTRAINT "family_allowance_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_level_tables" ADD CONSTRAINT "family_level_tables_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_allowance_by_ages" ADD CONSTRAINT "public_allowance_by_ages_public_allowance_table_id_family_allowance_tables_id_fk" FOREIGN KEY ("public_allowance_table_id") REFERENCES "public"."family_allowance_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_allowance_by_ages" ADD CONSTRAINT "public_allowance_by_ages_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_level_by_ages" ADD CONSTRAINT "public_level_by_ages_public_level_table_id_family_level_tables_id_fk" FOREIGN KEY ("public_level_table_id") REFERENCES "public"."family_level_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_level_by_ages" ADD CONSTRAINT "public_level_by_ages_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_allowance_by_ages" ADD CONSTRAINT "template_allowance_by_ages_public_allowance_table_id_public_allowance_by_ages_id_fk" FOREIGN KEY ("public_allowance_table_id") REFERENCES "public"."public_allowance_by_ages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_allowance_by_ages" ADD CONSTRAINT "template_allowance_by_ages_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_level_by_ages" ADD CONSTRAINT "template_level_by_ages_public_level_table_id_public_level_by_ages_id_fk" FOREIGN KEY ("public_level_table_id") REFERENCES "public"."public_level_by_ages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_level_by_ages" ADD CONSTRAINT "template_level_by_ages_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;