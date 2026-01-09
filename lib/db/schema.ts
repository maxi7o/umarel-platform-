import { pgTable, uuid, text, integer, timestamp, pgEnum, boolean, jsonb, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const requestStatusEnum = pgEnum('request_status', ['open', 'in_progress', 'completed']);
export const sliceStatusEnum = pgEnum('slice_status', ['proposed', 'accepted', 'in_progress', 'completed', 'approved_by_client', 'paid', 'disputed']);
export const quoteStatusEnum = pgEnum('quote_status', ['pending', 'accepted', 'rejected']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'confirmed', 'disputed']);
export const bidStatusEnum = pgEnum('bid_status', ['pending', 'accepted', 'rejected']);
export const serviceOfferingStatusEnum = pgEnum('service_offering_status', ['active', 'paused', 'inactive']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending_escrow', 'in_escrow', 'released', 'refunded', 'failed', 'disputed']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'mercado_pago']);
export const biometricStatusEnum = pgEnum('biometric_status', ['none', 'pending', 'verified', 'failed']);

export const commentTypeEnum = pgEnum('comment_type', ['text', 'prompt', 'ai_response']);
export const auraLevelEnum = pgEnum('aura_level', ['bronze', 'silver', 'gold', 'diamond']);
export const wizardMessageRoleEnum = pgEnum('wizard_message_role', ['user', 'assistant', 'system']);
export const changeProposalStatusEnum = pgEnum('change_proposal_status', ['pending', 'accepted', 'rejected']);
export const currencyEnum = pgEnum('currency', ['ARS', 'USD', 'BRL', 'MXN', 'COP']);
export const qualityLevelEnum = pgEnum('quality_level', ['functional', 'standard', 'premium']);
export const materialAdvanceStatusEnum = pgEnum('material_advance_status', ['none', 'requested', 'approved', 'released', 'rejected']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    auraPoints: integer('aura_points').default(0),
    auraLevel: auraLevelEnum('aura_level').default('bronze'),
    totalSavingsGenerated: integer('total_savings_generated').default(0),
    role: userRoleEnum('role').default('user'),
    timezone: text('timezone').default('UTC'),
    lastCommentAt: timestamp('last_comment_at'), // Anti-spam cooldown
    lastTosAcceptedAt: timestamp('last_tos_accepted_at'),
    tosVersion: integer('tos_version').default(0), // Current active version

    // Biometric Verification
    biometricStatus: biometricStatusEnum('biometric_status').default('none'),
    biometricVerifiedAt: timestamp('biometric_verified_at'),

    createdAt: timestamp('created_at').defaultNow(),
});

export const requests = pgTable('requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    category: text('category'), // For filtering/browsing
    location: text('location'),
    locationDetails: jsonb('location_details'), // { lat, lng, address, ... }
    isVirtual: boolean('is_virtual').default(false),
    featured: boolean('featured').default(false), // Premium placement
    status: requestStatusEnum('status').default('open'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const refundStatusEnum = pgEnum('refund_status', ['none', 'requested', 'approved', 'disputed', 'resolved']);

export const slices = pgTable('slices', {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').references(() => requests.id).notNull(),
    creatorId: uuid('creator_id').references(() => users.id).notNull(),
    assignedProviderId: uuid('assigned_provider_id').references(() => users.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    estimatedEffort: text('estimated_effort'),
    estimatedHours: integer('estimated_hours'), // 1-4 hours (≤0.5 day)
    qualityLevel: qualityLevelEnum('quality_level').default('standard'), // functional, standard, premium
    marketPriceMin: integer('market_price_min'), // in cents
    marketPriceMax: integer('market_price_max'), // in cents
    finalPrice: integer('final_price'), // Agreed price in cents (set when accepted)
    status: sliceStatusEnum('status').default('proposed'),
    isAiGenerated: boolean('is_ai_generated').default(false),
    dependencies: jsonb('dependencies'), // Array of slice IDs

    // V2: Strict Criteria & Evidence
    acceptanceCriteria: jsonb('acceptance_criteria').$type<{ id: string, description: string, requiredEvidenceType: 'photo' | 'video' | 'file' }[]>(),
    evidenceRequirements: jsonb('evidence_requirements'), // Detailed config (e.g. time window)
    evidenceTimeWindowMinutes: integer('evidence_time_window_minutes'),
    ambiguityScore: integer('ambiguity_score').default(0), // 0-100 (100 = very ambiguous)
    isPublic: boolean('is_public').default(true),

    // Material Advance (Acopio)
    materialAdvanceStatus: materialAdvanceStatusEnum('material_advance_status').default('none'),
    materialAdvanceAmount: integer('material_advance_amount'), // 40% typically
    materialAdvanceEvidence: jsonb('material_advance_evidence'), // { photos: [], receipt: [] }

    // Refund Logic
    refundStatus: refundStatusEnum('refund_status').default('none'),
    refundReason: text('refund_reason'),
    disputeEvidence: jsonb('dispute_evidence'), // Array of URLs
    refundRequestedAt: timestamp('refund_requested_at'),
    refundDecidedAt: timestamp('refund_decided_at'),

    skillsRequired: jsonb('skills_required'), // Array of required skills
    escrowPaymentId: text('escrow_payment_id'), // Reference to escrow payment

    // Auto-Release Logic
    autoReleaseAt: timestamp('auto_release_at'), // When funds unlock automatically
    disputeStatus: text('dispute_status'), // 'none', 'open', 'resolved'

    approvedByClientAt: timestamp('approved_by_client_at'),
    paidAt: timestamp('paid_at'),
    disputedAt: timestamp('disputed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const quotes = pgTable('quotes', {
    id: uuid('id').primaryKey().defaultRandom(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    requestId: uuid('request_id').references(() => requests.id).notNull(), // Added direct link to request
    amount: integer('amount').notNull(), // in cents
    currency: currencyEnum('currency').default('ARS'),
    message: text('message'),

    // V2: Proposal of Criteria
    proposedAcceptanceCriteria: jsonb('proposed_acceptance_criteria').$type<{ id: string, description: string }[]>(),
    ambiguityReductionScore: integer('ambiguity_reduction_score').default(0),

    estimatedDeliveryDate: timestamp('estimated_delivery_date'),
    status: quoteStatusEnum('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const quoteItems = pgTable('quote_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    quoteId: uuid('quote_id').references(() => quotes.id).notNull(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
});

export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').references(() => requests.id),
    quoteId: uuid('quote_id').references(() => quotes.id),
    userId: uuid('user_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    type: commentTypeEnum('type').default('text'),
    isAiGenerated: boolean('is_ai_generated').default(false),
    heartsCount: integer('hearts_count').default(0),
    isMarkedHelpful: boolean('is_marked_helpful').default(false),
    markedHelpfulBy: uuid('marked_helpful_by').references(() => users.id),
    savingsGenerated: integer('savings_generated').default(0), // Amount saved in cents
    createdAt: timestamp('created_at').defaultNow(),
});

export const questionStatusEnum = pgEnum('question_status', ['pending', 'forwarded_to_community', 'answered']);

export const questions = pgTable('questions', {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').references(() => requests.id).notNull(),
    askerId: uuid('asker_id').references(() => users.id).notNull(), // Service provider asking
    content: text('content').notNull(),
    status: questionStatusEnum('status').default('pending'),
    forwardedToCommunity: boolean('forwarded_to_community').default(false),
    relatedSliceIds: jsonb('related_slice_ids'), // Array of slice IDs influenced by this Q&A
    createdAt: timestamp('created_at').defaultNow(),
});

export const answers = pgTable('answers', {
    id: uuid('id').primaryKey().defaultRandom(),
    questionId: uuid('question_id').references(() => questions.id).notNull(),
    answererId: uuid('answerer_id').references(() => users.id).notNull(), // Umarel answering
    content: text('content').notNull(),
    upvotes: integer('upvotes').default(0),
    auraReward: integer('aura_reward').default(0), // Aura points earned immediately
    moneyReward: integer('money_reward').default(0), // Money earned immediately (in cents)
    contributionScore: integer('contribution_score').default(0), // Calculated based on downstream value
    totalRewardsEarned: integer('total_rewards_earned').default(0), // Cumulative from transactions
    isAccepted: boolean('is_accepted').default(false), // Request owner can mark best answer
    createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    quoteId: uuid('quote_id').references(() => quotes.id).notNull(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    requesterId: uuid('requester_id').references(() => users.id).notNull(),
    amount: integer('amount').notNull(), // in cents
    platformFee: integer('platform_fee').notNull(), // in cents
    umarelRewards: integer('umarel_rewards').notNull(), // in cents (total pool)
    status: transactionStatusEnum('status').default('pending'),
    completedAt: timestamp('completed_at'),
    confirmedAt: timestamp('confirmed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const providerMetrics = pgTable('provider_metrics', {
    id: uuid('id').primaryKey().defaultRandom(),
    providerId: uuid('provider_id').references(() => users.id).notNull().unique(),
    totalSlicesCompleted: integer('total_slices_completed').default(0),
    totalSlicesOnTime: integer('total_slices_on_time').default(0),
    averageCompletionHours: integer('average_completion_hours'),
    totalEarnings: integer('total_earnings').default(0), // in cents
    rating: integer('rating').default(0), // 0-100
    umarelEndorsements: integer('umarel_endorsements').default(0),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const sliceBids = pgTable('slice_bids', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    bidAmount: integer('bid_amount').notNull(), // in cents
    estimatedHours: integer('estimated_hours').notNull(),
    message: text('message'),
    status: bidStatusEnum('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const marketPricing = pgTable('market_pricing', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceType: text('slice_type').notNull(), // e.g., "plumbing", "demolition"
    category: text('category').notNull(), // e.g., "bathroom renovation"
    avgPrice: integer('avg_price').notNull(), // in cents
    minPrice: integer('min_price').notNull(),
    maxPrice: integer('max_price').notNull(),
    sampleSize: integer('sample_size').default(0),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const serviceOfferings = pgTable('service_offerings', {
    id: uuid('id').primaryKey().defaultRandom(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    title: text('title').notNull(), // "Experienced Plumber Available"
    description: text('description').notNull(),
    category: text('category').notNull(), // "plumbing", "electrical", etc.
    location: text('location'), // null if virtual
    locationDetails: jsonb('location_details'), // { lat, lng, address, ... }
    isVirtual: boolean('is_virtual').default(false),
    hourlyRate: integer('hourly_rate'), // in cents
    fixedRate: integer('fixed_rate'), // in cents (for fixed-price services)
    availability: text('availability'), // "Weekends", "Evenings", etc.
    calendarSyncUrl: text('calendar_sync_url'), // iCal/WebCal URL for availability

    // V2: Smart Forms & Dynamic Pricing
    aiInterviewerConfig: jsonb('ai_interviewer_config'), // { mode: 'dynamic', initial_questions: [] }
    pricingStrategy: text('pricing_strategy').default('standard'), // 'standard', 'distressed', 'early_bird'
    pricingOptions: jsonb('pricing_options'), // { decay_rate_per_hour: 500, min_price: 1000 }

    // V2: Group Experiences
    minParticipants: integer('min_participants').default(1),
    maxParticipants: integer('max_participants'),
    instantBookingEnabled: boolean('instant_booking_enabled').default(false), // If true, skips approval if slot free

    skills: jsonb('skills'), // Array of skills
    portfolioImages: jsonb('portfolio_images'), // Array of image URLs
    featured: boolean('featured').default(false), // Premium placement
    status: serviceOfferingStatusEnum('status').default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    read: integer('read').default(0), // 0 = unread, 1 = read
    link: text('link'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const conversations = pgTable('conversations', {
    id: uuid('id').primaryKey().defaultRandom(),
    participant1Id: uuid('participant1_id').references(() => users.id).notNull(),
    participant2Id: uuid('participant2_id').references(() => users.id).notNull(),
    lastMessageAt: timestamp('last_message_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
    senderId: uuid('sender_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    read: boolean('read').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    bio: text('bio'),
    tagline: text('tagline'),
    location: text('location'),
    website: text('website'),
    socialLinks: jsonb('social_links'), // { twitter: string, linkedin: string, etc. }
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const savedItems = pgTable('saved_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    requestId: uuid('request_id').references(() => requests.id),
    offeringId: uuid('offering_id').references(() => serviceOfferings.id),
    type: text('type').notNull(), // 'request' | 'offering'
    createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// PAYMENT SYSTEM TABLES (15% Model)
// ============================================

export const escrowPayments = pgTable('escrow_payments', {
    id: uuid('id').primaryKey().defaultRandom(),

    sliceId: uuid('slice_id').references(() => slices.id), // Made optional for Experiences
    experienceId: uuid('experience_id').references(() => experiences.id), // Added for Experiences
    clientId: uuid('client_id').references(() => users.id).notNull(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    totalAmount: integer('total_amount').notNull(), // slice price + 15% fee (in cents)
    sliceAmount: integer('slice_amount').notNull(), // actual slice price (in cents)
    platformFee: integer('platform_fee').notNull(), // 15% of slice price (in cents)
    communityRewardPool: integer('community_reward_pool').notNull(), // 3% of slice price (in cents)
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    mercadoPagoPreapprovalId: text('mercado_pago_preapproval_id'),
    mercadoPagoPaymentId: text('mercado_pago_payment_id'), // Added for One-Time Payments Refund
    status: paymentStatusEnum('status').default('pending_escrow'),

    // Dispute fields
    disputeReason: text('dispute_reason'),
    resolutionNotes: text('resolution_notes'),
    resolvedBy: uuid('resolved_by').references(() => users.id),

    // Appeal fields
    isAppealed: boolean('is_appealed').default(false),
    appealReason: text('appeal_reason'),
    appealedAt: timestamp('appealed_at'),

    // AI Analysis
    aiDisputeAnalysis: jsonb('ai_dispute_analysis'), // { recommendation: 'release'|'refund', confidence: 0-100, reasoning: string }

    createdAt: timestamp('created_at').defaultNow(),
    releasedAt: timestamp('released_at'),
    refundedAt: timestamp('refunded_at'),
});

export const communityRewards = pgTable('community_rewards', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    sliceId: uuid('slice_id').references(() => slices.id),
    commentId: uuid('comment_id').references(() => comments.id),
    amount: integer('amount').notNull(), // in cents
    reason: text('reason'), // "Helpful optimization comment"
    paidAt: timestamp('paid_at'),
    paymentMethod: text('payment_method'), // 'wallet_credit' | 'mercado_pago'
    createdAt: timestamp('created_at').defaultNow(),
});

export const userWallets = pgTable('user_wallets', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    balance: integer('balance').default(0), // in cents
    totalEarned: integer('total_earned').default(0), // in cents
    totalWithdrawn: integer('total_withdrawn').default(0), // in cents
    merchantOrderCount: integer('merchant_order_count').default(0),
    mercadoPagoEmail: text('mercado_pago_email'),
    mercadoPagoUserId: text('mercado_pago_user_id'),
    mercadoPagoAccessToken: text('mercado_pago_access_token'),
    mercadoPagoRefreshToken: text('mercado_pago_refresh_token'),
    mercadoPagoTokenExpiresAt: timestamp('mercado_pago_token_expires_at'),
    mercadoPagoPublicKey: text('mercado_pago_public_key'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const commentHearts = pgTable('comment_hearts', {
    id: uuid('id').primaryKey().defaultRandom(),
    commentId: uuid('comment_id').references(() => comments.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// WIZARD SYSTEM TABLES
// ============================================

export const sliceCards = pgTable('slice_cards', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull().unique(),
    requestId: uuid('request_id').references(() => requests.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    finalPrice: integer('final_price'), // in cents
    currency: currencyEnum('currency').default('ARS'),
    skills: jsonb('skills').$type<string[]>().default([]),
    qualityLevel: qualityLevelEnum('quality_level').default('standard'),
    estimatedTime: text('estimated_time'),
    dependencies: jsonb('dependencies').$type<string[]>().default([]),
    acceptanceCriteria: jsonb('acceptance_criteria').$type<string[]>().default([]),
    version: integer('version').default(1),
    isLocked: boolean('is_locked').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const wizardMessages = pgTable('wizard_messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceCardId: uuid('slice_card_id').references(() => sliceCards.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    role: wizardMessageRoleEnum('role').default('user'),
    hearts: integer('hearts').default(0),
    isMarkedHelpful: boolean('is_marked_helpful').default(false),
    markedHelpfulBy: uuid('marked_helpful_by').references(() => users.id),
    savingsGenerated: integer('savings_generated').default(0), // Amount saved in cents
    metadata: jsonb('metadata'), // AI model, tokens used, etc.
    createdAt: timestamp('created_at').defaultNow(),
});

export const dailyPayouts = pgTable('daily_payouts', {
    id: uuid('id').primaryKey().defaultRandom(),
    date: timestamp('date').notNull(),
    totalPool: integer('total_pool').notNull(), // Total 3% pool for the day
    distributed: boolean('distributed').default(false),
    recipients: jsonb('recipients').$type<{ userId: string, amount: number, auraScore: number }[]>(),
    createdAt: timestamp('created_at').defaultNow(),
    processedAt: timestamp('processed_at'),
});

export const exchangeRates = pgTable('exchange_rates', {
    id: uuid('id').primaryKey().defaultRandom(),
    baseCurrency: currencyEnum('base_currency').notNull(),
    targetCurrency: currencyEnum('target_currency').notNull(),
    rate: decimal('rate', { precision: 10, scale: 6 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Service Ratings - Customer satisfaction after service completion
export const serviceRatings = pgTable('service_ratings', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    requestId: uuid('request_id').references(() => requests.id).notNull(),
    providerId: uuid('provider_id').references(() => users.id).notNull(), // Who provided the service
    clientId: uuid('client_id').references(() => users.id).notNull(), // Who received the service

    // Rating dimensions (1-5 stars each)
    qualityRating: integer('quality_rating').notNull(), // Quality of work
    communicationRating: integer('communication_rating').notNull(), // Communication during service
    timelinessRating: integer('timeliness_rating').notNull(), // Met deadlines
    professionalismRating: integer('professionalism_rating').notNull(), // Professional behavior
    valueRating: integer('value_rating').notNull(), // Value for money

    // Overall satisfaction (calculated average)
    overallRating: decimal('overall_rating', { precision: 3, scale: 2 }).notNull(),

    // Optional feedback
    feedback: text('feedback'),
    wouldRecommend: boolean('would_recommend').default(true),

    // Aura impact tracking
    auraImpact: integer('aura_impact').default(0), // Points added/subtracted from provider's Aura

    createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// UMAREL SHARE AI EVALUATION TABLES
// ============================================

export const contributionEvaluations = pgTable('contribution_evaluations', {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').references(() => requests.id), // Link to request
    sliceId: uuid('slice_id').references(() => slices.id), // Link to slice (optional)
    evaluatorModel: text('evaluator_model').notNull(), // e.g., "gpt-4o"
    contributions: jsonb('contributions').$type<{
        userId: string;
        userName: string;
        score: number; // 0-10
        reasoning: string;
        contributionType: 'savings' | 'quality' | 'risk_mitigation';
    }[]>(),
    totalScore: integer('total_score').default(0), // Sum of all scores
    createdAt: timestamp('created_at').defaultNow(),
});

export const sliceEvidence = pgTable('slice_evidence', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    fileUrl: text('file_url').notNull(),
    fileType: text('file_type').default('image'),
    description: text('description'),
    metadata: jsonb('metadata'), // { lat, lng, altitude, accuracy, timestamp, deviceId }

    // V2: Strict Validation
    capturedAt: timestamp('captured_at'),
    deviceSignature: text('device_signature'), // Hash to detect camera roll vs live
    aiValidationStatus: text('ai_validation_status').default('pending'), // 'pending', 'approved', 'rejected'
    aiValidationJson: jsonb('ai_validation_json'), // Full AI analysis report

    isVerified: boolean('is_verified').default(false), // Trusted source vs EXIF
    createdAt: timestamp('created_at').defaultNow(),
});

// V2: Track Umarel Optimizations
export const umarelContributions = pgTable('umarel_contributions', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    umarelId: uuid('umarel_id').references(() => users.id).notNull(),
    contributionType: text('contribution_type').notNull(), // 'ambiguity_fix', 'pricing_insight', 'risk_flag'
    description: text('description').notNull(),
    impactScore: integer('impact_score').default(0), // 0-100
    status: text('status').default('pending'), // 'accepted', 'rejected', 'pending'
    createdAt: timestamp('created_at').defaultNow(),
});

export const changeProposals = pgTable('change_proposals', {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').references(() => requests.id).notNull(),
    sliceId: uuid('slice_id').references(() => slices.id), // Optional, if related to a specific existing slice
    commentId: uuid('comment_id').references(() => comments.id).notNull(),
    proposedActions: jsonb('proposed_actions').notNull(), // Array of WizardAction
    status: changeProposalStatusEnum('status').default('pending'),
    aiImpact: jsonb('ai_impact'), // { qualityScore, impactType, estimatedSavings }
    createdAt: timestamp('created_at').defaultNow(),
    reviewedAt: timestamp('reviewed_at'),
});

export const withdrawalStatusEnum = pgEnum('withdrawal_status', ['pending', 'processed', 'rejected']);

export const withdrawals = pgTable('withdrawals', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    amount: integer('amount').notNull(), // in cents
    status: withdrawalStatusEnum('status').default('pending'),
    method: text('method').default('mercadopago'),
    destination: text('destination'), // email or cbu
    requestedAt: timestamp('requested_at').defaultNow(),
    processedAt: timestamp('processed_at'),
    adminNotes: text('admin_notes'),
});

export const productInsights = pgTable('product_insights', {
    id: uuid('id').primaryKey().defaultRandom(),
    source: text('source').notNull(), // 'dispute', 'feedback', 'wizard'
    sourceId: text('source_id'), // ID of the related record (e.g. dispute ID or slice ID)
    insight: text('insight').notNull(), // The core "Adapt/Persevere" signal
    featureArea: text('feature_area'), // e.g. 'auto-assign', 'payments', 'chat'
    sentiment: text('sentiment'), // 'negative', 'neutral', 'positive'
    confidence: integer('confidence').default(0), // 0-100
    createdAt: timestamp('created_at').defaultNow(),
});

export const escrowPaymentsRelations = relations(escrowPayments, ({ one }) => ({
    slice: one(slices, {
        fields: [escrowPayments.sliceId],
        references: [slices.id],
    }),
}));

export const slicesRelations = relations(slices, ({ one, many }) => ({
    request: one(requests, {
        fields: [slices.requestId],
        references: [requests.id],
    }),
    evidence: many(sliceEvidence),
}));

export const sliceEvidenceRelations = relations(sliceEvidence, ({ one }) => ({
    slice: one(slices, {
        fields: [sliceEvidence.sliceId],
        references: [slices.id],
    }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
    user: one(users, {
        fields: [withdrawals.userId],
        references: [users.id],
    }),
}));

// ============================================
// CONTRACT SNAPSHOTS (Ricardian)
// ============================================

export const contracts = pgTable('contracts', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    quoteId: uuid('quote_id').references(() => quotes.id), // Optional for direct bids
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    clientId: uuid('client_id').references(() => users.id).notNull(),

    // The Agreed State (Immutable)
    snapshotJson: jsonb('snapshot_json').notNull(),
    // { sliceTitle, sliceDesc, price, currency, deliveryDate, acceptanceCriteria }

    contractHash: text('contract_hash').notNull(), // SHA-256 of the snapshot
    smartContractAddress: text('smart_contract_address'), // Optional: if deployed to chain

    createdAt: timestamp('created_at').defaultNow(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
    slice: one(slices, {
        fields: [contracts.sliceId],
        references: [slices.id],
    }),
    quote: one(quotes, {
        fields: [contracts.quoteId],
        references: [quotes.id],
    }),
    provider: one(users, {
        fields: [contracts.providerId],
        references: [users.id],
        relationName: 'providerContracts'
    }),
    client: one(users, {
        fields: [contracts.clientId],
        references: [users.id],
        relationName: 'clientContracts'
    }),
}));

// ============================================
// EXPERIENCES & DYNAMIC PRICING TABLES
// ============================================

export const experienceStatusEnum = pgEnum('experience_status', ['scheduled', 'confirmed', 'cancelled', 'completed']);
export const participantStatusEnum = pgEnum('participant_status', ['joined', 'refunded', 'attended']);

export const experiences = pgTable('experiences', {
    id: uuid('id').primaryKey().defaultRandom(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    location: text('location'),
    date: timestamp('date').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    minParticipants: integer('min_participants').default(1),
    maxParticipants: integer('max_participants'),
    pricingConfig: jsonb('pricing_config').notNull(), // { strategy: 'early_bird', tiers: [] }
    weatherDependent: boolean('weather_dependent').default(false),
    status: experienceStatusEnum('status').default('scheduled'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const experienceParticipants = pgTable('experience_participants', {
    id: uuid('id').primaryKey().defaultRandom(),
    experienceId: uuid('experience_id').references(() => experiences.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(), // The client
    pricePaid: integer('price_paid').notNull(), // in cents
    status: participantStatusEnum('status').default('joined'),
    escrowPaymentId: uuid('escrow_payment_id').references(() => escrowPayments.id), // Link to payment
    joinedAt: timestamp('joined_at').defaultNow(),
});

export const experiencesRelations = relations(experiences, ({ one, many }) => ({
    provider: one(users, {
        fields: [experiences.providerId],
        references: [users.id],
    }),
    participants: many(experienceParticipants),
}));

export const experienceParticipantsRelations = relations(experienceParticipants, ({ one }) => ({
    experience: one(experiences, {
        fields: [experienceParticipants.experienceId],
        references: [experiences.id],
    }),
    user: one(users, {
        fields: [experienceParticipants.userId],
        references: [users.id],
    }),
    payment: one(escrowPayments, {
        fields: [experienceParticipants.escrowPaymentId],
        references: [escrowPayments.id],
    }),
}));


// ============================================
// DISPUTE RESOLUTION & AI JUDGE
// ============================================

export const disputeStatusEnum = pgEnum('dispute_status', ['open', 'evidence_submission', 'analyzing', 'resolved_refund', 'resolved_release', 'appealed', 'jury_deliberation']);

export const disputes = pgTable('disputes', {
    id: uuid('id').primaryKey().defaultRandom(),
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    initiatorId: uuid('initiator_id').references(() => users.id).notNull(),
    reason: text('reason').notNull(),
    status: disputeStatusEnum('status').default('open'),

    // AI Analysis
    aiVerdict: jsonb('ai_verdict'), // { decision: 'release', confidence: 0.95, reasoning: '...' }

    // Jury Protocol
    juryStatus: text('jury_status').default('none'), // none, selecting, voting, completed
    juryResolution: text('jury_resolution'), // release, refund

    // Financial Result
    finalRuling: text('final_ruling'),

    // Honey Pot Auditing (Juror Integrity)
    isHoneyPot: boolean('is_honey_pot').default(false),
    correctVerdict: text('correct_verdict'), // 'resolved_release' | 'resolved_refund'

    createdAt: timestamp('created_at').defaultNow(),
    resolvedAt: timestamp('resolved_at'),
});

export const disputeEvidence = pgTable('dispute_evidence', {
    id: uuid('id').primaryKey().defaultRandom(),
    disputeId: uuid('dispute_id').references(() => disputes.id).notNull(),
    uploaderId: uuid('uploader_id').references(() => users.id).notNull(), // Provider or Client
    mediaUrl: text('media_url').notNull(),
    mimeType: text('mime_type').default('image/jpeg'),
    description: text('description'),

    // Proof Metadata
    metadata: jsonb('metadata'), // { gps: {lat, lng}, timestamp: '...' }

    createdAt: timestamp('created_at').defaultNow(),
});

export const disputeJurors = pgTable('dispute_jurors', {
    id: uuid('id').primaryKey().defaultRandom(),
    disputeId: uuid('dispute_id').references(() => disputes.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(), // The Random Juror
    status: text('status').default('pending'), // pending, voted
    vote: text('vote'), // resolved_release, resolved_refund (matches disputeStatus logic)
    reason: text('reason'),
    votedAt: timestamp('voted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    rewardDistributed: boolean('reward_distributed').default(false),
});

export const disputesRelations = relations(disputes, ({ one, many }) => ({
    slice: one(slices, {
        fields: [disputes.sliceId],
        references: [slices.id],
    }),
    initiator: one(users, {
        fields: [disputes.initiatorId],
        references: [users.id],
    }),
    evidence: many(disputeEvidence),
}));

export const disputeEvidenceRelations = relations(disputeEvidence, ({ one }) => ({
    dispute: one(disputes, {
        fields: [disputeEvidence.disputeId],
        references: [disputes.id],
    }),
    uploader: one(users, {
        fields: [disputeEvidence.uploaderId],
        references: [users.id],
    }),
}));

export const disputeJurorsRelations = relations(disputeJurors, ({ one }) => ({
    dispute: one(disputes, {
        fields: [disputeJurors.disputeId],
        references: [disputes.id],
    }),
    user: one(users, {
        fields: [disputeJurors.userId],
        references: [users.id],
    }),
}));
