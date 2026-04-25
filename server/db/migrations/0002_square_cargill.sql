ALTER TABLE "post_reaction" RENAME TO "like";--> statement-breakpoint
ALTER TABLE "like" DROP CONSTRAINT "reaction_post_user_unique";--> statement-breakpoint
ALTER TABLE "like" DROP CONSTRAINT "post_reaction_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "like" DROP CONSTRAINT "post_reaction_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "like" DROP COLUMN "reaction_type";--> statement-breakpoint
DROP TYPE "public"."reaction_type_enum";