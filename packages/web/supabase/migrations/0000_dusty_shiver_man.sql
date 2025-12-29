CREATE TYPE "public"."quest_type" AS ENUM('template', 'public', 'family');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('parent', 'child');--> statement-breakpoint
-- CREATE TABLE "auth"."users" (
-- 	"id" uuid PRIMARY KEY NOT NULL
-- );
--> statement-breakpoint
CREATE TABLE "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"invite_code" text NOT NULL,
	"min_savings" integer DEFAULT 0 NOT NULL,
	"current_savings" integer DEFAULT 0 NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"total_exp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "children_profile_id_unique" UNIQUE("profile_id"),
	CONSTRAINT "children_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_id" text NOT NULL,
	"local_name" text NOT NULL,
	"online_name" text,
	"introduction" text DEFAULT '' NOT NULL,
	"icon_id" integer NOT NULL,
	"icon_color" text NOT NULL,
	"invite_code" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "families_display_id_unique" UNIQUE("display_id"),
	CONSTRAINT "families_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "family_quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quest_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_client_public" boolean DEFAULT false NOT NULL,
	"is_request_detail_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "family_quests_quest_id_unique" UNIQUE("quest_id")
);
--> statement-breakpoint
CREATE TABLE "icon_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "icon_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text DEFAULT '' NOT NULL,
	"icon_name" text DEFAULT '' NOT NULL,
	"icon_size" integer,
	"sort_order" integer DEFAULT 999 NOT NULL,
	CONSTRAINT "icon_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "icons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "icons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text DEFAULT '' NOT NULL,
	"category_id" integer,
	"size" integer,
	CONSTRAINT "icons_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "parents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"invite_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parents_profile_id_unique" UNIQUE("profile_id"),
	CONSTRAINT "parents_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"birthday" date,
	"family_id" uuid,
	"icon_id" integer NOT NULL,
	"icon_color" text NOT NULL,
	"type" "user_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "quest_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quest_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text DEFAULT '' NOT NULL,
	"icon_name" text DEFAULT '' NOT NULL,
	"icon_size" integer,
	"icon_color" text,
	"sort_order" integer DEFAULT 999 NOT NULL,
	CONSTRAINT "quest_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "quest_children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_quest_id" uuid NOT NULL,
	"child_id" uuid NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_details" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"quest_id" uuid NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"success_condition" text DEFAULT '' NOT NULL,
	"required_completion_count" integer DEFAULT 1 NOT NULL,
	"reward" integer DEFAULT 0 NOT NULL,
	"child_exp" integer DEFAULT 0 NOT NULL,
	"required_clear_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_tags" (
	"name" text DEFAULT '' NOT NULL,
	"quest_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"type" "quest_type" NOT NULL,
	"category_id" integer,
	"icon_id" integer NOT NULL,
	"icon_color" text NOT NULL,
	"age_from" integer,
	"age_to" integer,
	"month_from" integer,
	"month_to" integer,
	"client" text DEFAULT '' NOT NULL,
	"request_detail" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_quests" ADD CONSTRAINT "family_quests_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_quests" ADD CONSTRAINT "family_quests_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icons" ADD CONSTRAINT "icons_category_id_icon_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."icon_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_children" ADD CONSTRAINT "quest_children_family_quest_id_family_quests_id_fk" FOREIGN KEY ("family_quest_id") REFERENCES "public"."family_quests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_children" ADD CONSTRAINT "quest_children_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_details" ADD CONSTRAINT "quest_details_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_tags" ADD CONSTRAINT "quest_tags_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_category_id_quest_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."quest_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE restrict ON UPDATE no action;
