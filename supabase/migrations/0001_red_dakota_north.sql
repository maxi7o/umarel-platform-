CREATE TYPE "public"."experience_status" AS ENUM('scheduled', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."participant_status" AS ENUM('joined', 'refunded', 'attended');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('pending', 'processed', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."payment_status" ADD VALUE 'disputed';--> statement-breakpoint
ALTER TYPE "public"."slice_status" ADD VALUE 'disputed';--> statement-breakpoint
CREATE TABLE "experience_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"price_paid" integer NOT NULL,
	"status" "participant_status" DEFAULT 'joined',
	"escrow_payment_id" uuid,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text,
	"date" timestamp NOT NULL,
	"duration_minutes" integer NOT NULL,
	"min_participants" integer DEFAULT 1,
	"max_participants" integer,
	"pricing_config" jsonb NOT NULL,
	"weather_dependent" boolean DEFAULT false,
	"status" "experience_status" DEFAULT 'scheduled',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"status" "withdrawal_status" DEFAULT 'pending',
	"method" text DEFAULT 'mercadopago',
	"destination" text,
	"requested_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"admin_notes" text
);
--> statement-breakpoint
ALTER TABLE "escrow_payments" ALTER COLUMN "slice_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "experience_id" uuid;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "dispute_reason" text;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "resolution_notes" text;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "resolved_by" uuid;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "is_appealed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "appeal_reason" text;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "appealed_at" timestamp;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD COLUMN "ai_dispute_analysis" jsonb;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "currency" "currency" DEFAULT 'ARS';--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "location_details" jsonb;--> statement-breakpoint
ALTER TABLE "service_offerings" ADD COLUMN "location_details" jsonb;--> statement-breakpoint
ALTER TABLE "slice_evidence" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "slice_evidence" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "slices" ADD COLUMN "disputed_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" text DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_comment_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_tos_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tos_version" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "experience_participants" ADD CONSTRAINT "experience_participants_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_participants" ADD CONSTRAINT "experience_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_participants" ADD CONSTRAINT "experience_participants_escrow_payment_id_escrow_payments_id_fk" FOREIGN KEY ("escrow_payment_id") REFERENCES "public"."escrow_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;