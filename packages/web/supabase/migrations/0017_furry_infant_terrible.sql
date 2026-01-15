ALTER TYPE "public"."notification_type" ADD VALUE 'quest_report_rejected' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'quest_report_approved' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'quest_cleared' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'quest_level_up' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'quest_completed' BEFORE 'other';