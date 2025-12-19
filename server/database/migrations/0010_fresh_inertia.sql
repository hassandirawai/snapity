ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_following_id_pk";--> statement-breakpoint
ALTER TABLE "follows" DROP COLUMN "created_at";