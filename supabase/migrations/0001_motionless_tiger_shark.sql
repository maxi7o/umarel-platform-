CREATE TYPE "public"."refund_status" AS ENUM('none', 'requested', 'approved', 'disputed', 'resolved');--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "refund_status" "refund_status" DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "refund_reason" text;--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "dispute_evidence" jsonb;--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "refund_requested_at" timestamp;--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "refund_decided_at" timestamp;