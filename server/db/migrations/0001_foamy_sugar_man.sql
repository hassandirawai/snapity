ALTER TABLE "media" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."media_type";--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('IMAGE', 'VIDEO');--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "type" SET DATA TYPE "public"."media_type" USING "type"::"public"."media_type";--> statement-breakpoint
ALTER TABLE "post_reaction" ALTER COLUMN "reaction_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."reaction_type_enum";--> statement-breakpoint
CREATE TYPE "public"."reaction_type_enum" AS ENUM('LIKE', 'DISLIKE');--> statement-breakpoint
ALTER TABLE "post_reaction" ALTER COLUMN "reaction_type" SET DATA TYPE "public"."reaction_type_enum" USING "reaction_type"::"public"."reaction_type_enum";