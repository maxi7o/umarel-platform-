CREATE TYPE "public"."material_advance_status" AS ENUM('none', 'requested', 'approved', 'released', 'rejected');--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "material_advance_status" "material_advance_status" DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "material_advance_amount" integer;--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "material_advance_evidence" jsonb;