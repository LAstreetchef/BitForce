CREATE TABLE "ambassador_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"action_type" text NOT NULL,
	"points_awarded" integer NOT NULL,
	"lead_id" integer,
	"lead_service_id" integer,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ambassador_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_type" text NOT NULL,
	"earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ambassador_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"notes" text,
	"email_sent_type" text,
	"email_sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ambassador_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"inviter_user_id" text NOT NULL,
	"inviter_name" text NOT NULL,
	"invitee_email" text NOT NULL,
	"invitee_name" text NOT NULL,
	"referral_code" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"accepted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ambassador_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_activity_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ambassador_points_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "ambassador_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"referral_code" text NOT NULL,
	"referred_by_code" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"signup_fee_paid" boolean DEFAULT false,
	"subscription_status" text DEFAULT 'inactive',
	"first_month_completed" boolean DEFAULT false,
	"onboarding_completed" boolean DEFAULT false,
	"onboarding_step" integer DEFAULT 0,
	"agreed_to_terms" boolean DEFAULT false,
	"agreed_to_terms_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ambassador_subscriptions_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "coupon_app_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"scope" text DEFAULT 'read:customers read:leads write:coupon-books',
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp,
	CONSTRAINT "coupon_app_tokens_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "coupon_app_tokens_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"experience" text,
	"event_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"listing_id" integer,
	"service_name" text NOT NULL,
	"status" text DEFAULT 'suggested' NOT NULL,
	"notes" text,
	"ambassador_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"interests" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"subcategory" text,
	"price" text,
	"price_note" text,
	"booking_url" text,
	"contact_phone" text,
	"contact_email" text,
	"service_area" text,
	"keywords" text[],
	"source_url" text,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"scraped_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recurring_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_id" integer NOT NULL,
	"referred_ambassador_id" integer NOT NULL,
	"monthly_amount" numeric(10, 2) DEFAULT '4.00' NOT NULL,
	"month" text NOT NULL,
	"status" text DEFAULT 'pending',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_bonuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_id" integer NOT NULL,
	"referred_ambassador_id" integer NOT NULL,
	"bonus_amount" numeric(10, 2) DEFAULT '50.00' NOT NULL,
	"status" text DEFAULT 'pending',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website" text NOT NULL,
	"description" text,
	"service_area" text DEFAULT 'Houston',
	"categories" text[],
	"logo_url" text,
	"is_active" boolean DEFAULT true,
	"last_scraped_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shared_coupon_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_user_id" text NOT NULL,
	"customer_id" integer,
	"lead_id" integer,
	"title" text NOT NULL,
	"coupons_data" text NOT NULL,
	"total_savings" text,
	"share_via" text NOT NULL,
	"status" text DEFAULT 'pending',
	"shared_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_user_id" text NOT NULL,
	"ambassador_name" text NOT NULL,
	"content" text NOT NULL,
	"sender" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "withings_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"ambassador_user_id" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_name" text,
	"withings_user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"scope" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");