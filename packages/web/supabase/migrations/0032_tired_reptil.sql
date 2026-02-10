ALTER TABLE "reward_histories" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."reward_type";--> statement-breakpoint
CREATE TYPE "public"."reward_type" AS ENUM('quest', 'age_monthly', 'level_monthly', 'other');--> statement-breakpoint
ALTER TABLE "reward_histories" ALTER COLUMN "type" SET DATA TYPE "public"."reward_type" USING "type"::"public"."reward_type";