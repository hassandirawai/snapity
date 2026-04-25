ALTER TABLE "like" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_user_post_unique" UNIQUE("user_id","post_id");