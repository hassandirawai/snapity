CREATE TYPE "public"."notification_type" AS ENUM('LIKE', 'COMMENT', 'MENTION', 'FOLLOW', 'SYSTEM');--> statement-breakpoint
ALTER TABLE "notification" RENAME COLUMN "read" TO "is_read";--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "type" "notification_type" NOT NULL;