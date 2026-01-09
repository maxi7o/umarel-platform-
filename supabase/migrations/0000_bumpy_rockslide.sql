CREATE TYPE "public"."aura_level" AS ENUM('bronze', 'silver', 'gold', 'diamond');--> statement-breakpoint
CREATE TYPE "public"."bid_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."biometric_status" AS ENUM('none', 'pending', 'verified', 'failed');--> statement-breakpoint
CREATE TYPE "public"."change_proposal_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."comment_type" AS ENUM('text', 'prompt', 'ai_response');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('ARS', 'USD', 'BRL', 'MXN', 'COP');--> statement-breakpoint
CREATE TYPE "public"."dispute_status" AS ENUM('open', 'evidence_submission', 'analyzing', 'resolved_refund', 'resolved_release', 'appealed', 'jury_deliberation');--> statement-breakpoint
CREATE TYPE "public"."experience_status" AS ENUM('scheduled', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."participant_status" AS ENUM('joined', 'refunded', 'attended');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'mercado_pago');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending_escrow', 'in_escrow', 'released', 'refunded', 'failed', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."quality_level" AS ENUM('functional', 'standard', 'premium');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('pending', 'forwarded_to_community', 'answered');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('none', 'requested', 'approved', 'disputed', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('open', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."service_offering_status" AS ENUM('active', 'paused', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."slice_status" AS ENUM('proposed', 'accepted', 'in_progress', 'completed', 'approved_by_client', 'paid', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'confirmed', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('pending', 'processed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."wizard_message_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"answerer_id" uuid NOT NULL,
	"content" text NOT NULL,
	"upvotes" integer DEFAULT 0,
	"aura_reward" integer DEFAULT 0,
	"money_reward" integer DEFAULT 0,
	"contribution_score" integer DEFAULT 0,
	"total_rewards_earned" integer DEFAULT 0,
	"is_accepted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "change_proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"slice_id" uuid,
	"comment_id" uuid NOT NULL,
	"proposed_actions" jsonb NOT NULL,
	"status" "change_proposal_status" DEFAULT 'pending',
	"ai_impact" jsonb,
	"created_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "comment_hearts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"quote_id" uuid,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"type" "comment_type" DEFAULT 'text',
	"is_ai_generated" boolean DEFAULT false,
	"hearts_count" integer DEFAULT 0,
	"is_marked_helpful" boolean DEFAULT false,
	"marked_helpful_by" uuid,
	"savings_generated" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slice_id" uuid,
	"comment_id" uuid,
	"amount" integer NOT NULL,
	"reason" text,
	"paid_at" timestamp,
	"payment_method" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"quote_id" uuid,
	"provider_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"snapshot_json" jsonb NOT NULL,
	"contract_hash" text NOT NULL,
	"smart_contract_address" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contribution_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"slice_id" uuid,
	"evaluator_model" text NOT NULL,
	"contributions" jsonb,
	"total_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant1_id" uuid NOT NULL,
	"participant2_id" uuid NOT NULL,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"total_pool" integer NOT NULL,
	"distributed" boolean DEFAULT false,
	"recipients" jsonb,
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "dispute_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispute_id" uuid NOT NULL,
	"uploader_id" uuid NOT NULL,
	"media_url" text NOT NULL,
	"mime_type" text DEFAULT 'image/jpeg',
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dispute_jurors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispute_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'pending',
	"vote" text,
	"reason" text,
	"voted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"reward_distributed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"initiator_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"status" "dispute_status" DEFAULT 'open',
	"ai_verdict" jsonb,
	"jury_status" text DEFAULT 'none',
	"jury_resolution" text,
	"final_ruling" text,
	"is_honey_pot" boolean DEFAULT false,
	"correct_verdict" text,
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "escrow_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid,
	"experience_id" uuid,
	"client_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"total_amount" integer NOT NULL,
	"slice_amount" integer NOT NULL,
	"platform_fee" integer NOT NULL,
	"community_reward_pool" integer NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"stripe_payment_intent_id" text,
	"mercado_pago_preapproval_id" text,
	"mercado_pago_payment_id" text,
	"status" "payment_status" DEFAULT 'pending_escrow',
	"dispute_reason" text,
	"resolution_notes" text,
	"resolved_by" uuid,
	"is_appealed" boolean DEFAULT false,
	"appeal_reason" text,
	"appealed_at" timestamp,
	"ai_dispute_analysis" jsonb,
	"created_at" timestamp DEFAULT now(),
	"released_at" timestamp,
	"refunded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_currency" "currency" NOT NULL,
	"target_currency" "currency" NOT NULL,
	"rate" numeric(10, 6) NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
CREATE TABLE "market_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_type" text NOT NULL,
	"category" text NOT NULL,
	"avg_price" integer NOT NULL,
	"min_price" integer NOT NULL,
	"max_price" integer NOT NULL,
	"sample_size" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" integer DEFAULT 0,
	"link" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"source_id" text,
	"insight" text NOT NULL,
	"feature_area" text,
	"sentiment" text,
	"confidence" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" text,
	"tagline" text,
	"location" text,
	"website" text,
	"social_links" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "provider_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"total_slices_completed" integer DEFAULT 0,
	"total_slices_on_time" integer DEFAULT 0,
	"average_completion_hours" integer,
	"total_earnings" integer DEFAULT 0,
	"rating" integer DEFAULT 0,
	"umarel_endorsements" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "provider_metrics_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"asker_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "question_status" DEFAULT 'pending',
	"forwarded_to_community" boolean DEFAULT false,
	"related_slice_ids" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quote_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_id" uuid NOT NULL,
	"slice_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"request_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" "currency" DEFAULT 'ARS',
	"message" text,
	"proposed_acceptance_criteria" jsonb,
	"ambiguity_reduction_score" integer DEFAULT 0,
	"estimated_delivery_date" timestamp,
	"status" "quote_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text,
	"location" text,
	"location_details" jsonb,
	"is_virtual" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"status" "request_status" DEFAULT 'open',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"request_id" uuid,
	"offering_id" uuid,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"location" text,
	"location_details" jsonb,
	"is_virtual" boolean DEFAULT false,
	"hourly_rate" integer,
	"fixed_rate" integer,
	"availability" text,
	"calendar_sync_url" text,
	"ai_interviewer_config" jsonb,
	"pricing_strategy" text DEFAULT 'standard',
	"pricing_options" jsonb,
	"min_participants" integer DEFAULT 1,
	"max_participants" integer,
	"instant_booking_enabled" boolean DEFAULT false,
	"skills" jsonb,
	"portfolio_images" jsonb,
	"featured" boolean DEFAULT false,
	"status" "service_offering_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"request_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"quality_rating" integer NOT NULL,
	"communication_rating" integer NOT NULL,
	"timeliness_rating" integer NOT NULL,
	"professionalism_rating" integer NOT NULL,
	"value_rating" integer NOT NULL,
	"overall_rating" numeric(3, 2) NOT NULL,
	"feedback" text,
	"would_recommend" boolean DEFAULT true,
	"aura_impact" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "slice_bids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"bid_amount" integer NOT NULL,
	"estimated_hours" integer NOT NULL,
	"message" text,
	"status" "bid_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "slice_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"request_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"final_price" integer,
	"currency" "currency" DEFAULT 'ARS',
	"skills" jsonb DEFAULT '[]'::jsonb,
	"quality_level" "quality_level" DEFAULT 'standard',
	"estimated_time" text,
	"dependencies" jsonb DEFAULT '[]'::jsonb,
	"acceptance_criteria" jsonb DEFAULT '[]'::jsonb,
	"version" integer DEFAULT 1,
	"is_locked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "slice_cards_slice_id_unique" UNIQUE("slice_id")
);
--> statement-breakpoint
CREATE TABLE "slice_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text DEFAULT 'image',
	"description" text,
	"metadata" jsonb,
	"captured_at" timestamp,
	"device_signature" text,
	"ai_validation_status" text DEFAULT 'pending',
	"ai_validation_json" jsonb,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "slices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"assigned_provider_id" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimated_effort" text,
	"estimated_hours" integer,
	"quality_level" "quality_level" DEFAULT 'standard',
	"market_price_min" integer,
	"market_price_max" integer,
	"final_price" integer,
	"status" "slice_status" DEFAULT 'proposed',
	"is_ai_generated" boolean DEFAULT false,
	"dependencies" jsonb,
	"acceptance_criteria" jsonb,
	"evidence_requirements" jsonb,
	"evidence_time_window_minutes" integer,
	"ambiguity_score" integer DEFAULT 0,
	"is_public" boolean DEFAULT true,
	"refund_status" "refund_status" DEFAULT 'none',
	"refund_reason" text,
	"dispute_evidence" jsonb,
	"refund_requested_at" timestamp,
	"refund_decided_at" timestamp,
	"skills_required" jsonb,
	"escrow_payment_id" text,
	"auto_release_at" timestamp,
	"dispute_status" text,
	"approved_by_client_at" timestamp,
	"paid_at" timestamp,
	"disputed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"quote_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"requester_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"platform_fee" integer NOT NULL,
	"umarel_rewards" integer NOT NULL,
	"status" "transaction_status" DEFAULT 'pending',
	"completed_at" timestamp,
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "umarel_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"umarel_id" uuid NOT NULL,
	"contribution_type" text NOT NULL,
	"description" text NOT NULL,
	"impact_score" integer DEFAULT 0,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"balance" integer DEFAULT 0,
	"total_earned" integer DEFAULT 0,
	"total_withdrawn" integer DEFAULT 0,
	"merchant_order_count" integer DEFAULT 0,
	"mercado_pago_email" text,
	"mercado_pago_user_id" text,
	"mercado_pago_access_token" text,
	"mercado_pago_refresh_token" text,
	"mercado_pago_token_expires_at" timestamp,
	"mercado_pago_public_key" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"aura_points" integer DEFAULT 0,
	"aura_level" "aura_level" DEFAULT 'bronze',
	"total_savings_generated" integer DEFAULT 0,
	"role" "user_role" DEFAULT 'user',
	"timezone" text DEFAULT 'UTC',
	"last_comment_at" timestamp,
	"last_tos_accepted_at" timestamp,
	"tos_version" integer DEFAULT 0,
	"biometric_status" "biometric_status" DEFAULT 'none',
	"biometric_verified_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
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
CREATE TABLE "wizard_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_card_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"role" "wizard_message_role" DEFAULT 'user',
	"hearts" integer DEFAULT 0,
	"is_marked_helpful" boolean DEFAULT false,
	"marked_helpful_by" uuid,
	"savings_generated" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_answerer_id_users_id_fk" FOREIGN KEY ("answerer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_proposals" ADD CONSTRAINT "change_proposals_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_proposals" ADD CONSTRAINT "change_proposals_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_proposals" ADD CONSTRAINT "change_proposals_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_hearts" ADD CONSTRAINT "comment_hearts_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_hearts" ADD CONSTRAINT "comment_hearts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_marked_helpful_by_users_id_fk" FOREIGN KEY ("marked_helpful_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_rewards" ADD CONSTRAINT "community_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_rewards" ADD CONSTRAINT "community_rewards_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_rewards" ADD CONSTRAINT "community_rewards_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_evaluations" ADD CONSTRAINT "contribution_evaluations_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_evaluations" ADD CONSTRAINT "contribution_evaluations_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant1_id_users_id_fk" FOREIGN KEY ("participant1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant2_id_users_id_fk" FOREIGN KEY ("participant2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_dispute_id_disputes_id_fk" FOREIGN KEY ("dispute_id") REFERENCES "public"."disputes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_jurors" ADD CONSTRAINT "dispute_jurors_dispute_id_disputes_id_fk" FOREIGN KEY ("dispute_id") REFERENCES "public"."disputes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_jurors" ADD CONSTRAINT "dispute_jurors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_initiator_id_users_id_fk" FOREIGN KEY ("initiator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_payments" ADD CONSTRAINT "escrow_payments_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_participants" ADD CONSTRAINT "experience_participants_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_participants" ADD CONSTRAINT "experience_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_participants" ADD CONSTRAINT "experience_participants_escrow_payment_id_escrow_payments_id_fk" FOREIGN KEY ("escrow_payment_id") REFERENCES "public"."escrow_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_metrics" ADD CONSTRAINT "provider_metrics_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_asker_id_users_id_fk" FOREIGN KEY ("asker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_offering_id_service_offerings_id_fk" FOREIGN KEY ("offering_id") REFERENCES "public"."service_offerings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_ratings" ADD CONSTRAINT "service_ratings_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_ratings" ADD CONSTRAINT "service_ratings_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_ratings" ADD CONSTRAINT "service_ratings_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_ratings" ADD CONSTRAINT "service_ratings_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_bids" ADD CONSTRAINT "slice_bids_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_bids" ADD CONSTRAINT "slice_bids_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_cards" ADD CONSTRAINT "slice_cards_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_cards" ADD CONSTRAINT "slice_cards_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_evidence" ADD CONSTRAINT "slice_evidence_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_evidence" ADD CONSTRAINT "slice_evidence_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slices" ADD CONSTRAINT "slices_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slices" ADD CONSTRAINT "slices_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slices" ADD CONSTRAINT "slices_assigned_provider_id_users_id_fk" FOREIGN KEY ("assigned_provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "umarel_contributions" ADD CONSTRAINT "umarel_contributions_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "umarel_contributions" ADD CONSTRAINT "umarel_contributions_umarel_id_users_id_fk" FOREIGN KEY ("umarel_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "user_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wizard_messages" ADD CONSTRAINT "wizard_messages_slice_card_id_slice_cards_id_fk" FOREIGN KEY ("slice_card_id") REFERENCES "public"."slice_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wizard_messages" ADD CONSTRAINT "wizard_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wizard_messages" ADD CONSTRAINT "wizard_messages_marked_helpful_by_users_id_fk" FOREIGN KEY ("marked_helpful_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;