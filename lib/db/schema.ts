import { pgTable, uuid, text, integer, timestamp, pgEnum, boolean, jsonb, decimal } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const requestStatusEnum = pgEnum('request_status', ['open', 'in_progress', 'completed']);
export const sliceStatusEnum = pgEnum('slice_status', ['proposed', 'accepted', 'in_progress', 'completed', 'approved_by_client', 'paid']);
export const quoteStatusEnum = pgEnum('quote_status', ['pending', 'accepted', 'rejected']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'confirmed', 'disputed']);
export const bidStatusEnum = pgEnum('bid_status', ['pending', 'accepted', 'rejected']);
export const serviceOfferingStatusEnum = pgEnum('service_offering_status', ['active', 'paused', 'inactive']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending_escrow', 'in_escrow', 'released', 'refunded', 'failed']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'mercado_pago']);

export const commentTypeEnum = pgEnum('comment_type', ['text', 'prompt', 'ai_response']);
export const auraLevelEnum = pgEnum('aura_level', ['bronze', 'silver', 'gold', 'diamond']);
export const wizardMessageRoleEnum = pgEnum('wizard_message_role', ['user', 'assistant', 'system']);
export const currencyEnum = pgEnum('currency', ['ARS', 'USD', 'BRL', 'MXN', 'COP']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    auraPoints: integer('aura_points').default(0),
    auraLevel: auraLevelEnum('aura_level').default('bronze'),
    totalSavingsGenerated: integer('total_savings_generated').default(0),
    role: userRoleEnum('role').default('user'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const requests = pgTable('requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    category: text('category'), // For filtering/browsing
    location: text('location'),
    isVirtual: boolean('is_virtual').default(false),
    featured: boolean('featured').default(false), // Premium placement
    status: requestStatusEnum('status').default('open'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const slices = pgTable('slices', {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').references(() => requests.id).notNull(),
    creatorId: uuid('creator_id').references(() => users.id).notNull(),
    assignedProviderId: uuid('assigned_provider_id').references(() => users.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    estimatedEffort: text('estimated_effort'),
    estimatedHours: integer('estimated_hours'), // 1-4 hours (≤0.5 day)
    marketPriceMin: integer('market_price_min'), // in cents
    marketPriceMax: integer('market_price_max'), // in cents
    finalPrice: integer('final_price'), // Agreed price in cents (set when accepted)
    status: sliceStatusEnum('status').default('proposed'),
    isAiGenerated: boolean('is_ai_generated').default(false),
    dependencies: jsonb('dependencies'), // Array of slice IDs
    skillsRequired: jsonb('skills_required'), // Array of required skills
    escrowPaymentId: text('escrow_payment_id'), // Reference to escrow payment
    approvedByClientAt: timestamp('approved_by_client_at'),
    paidAt: timestamp('paid_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const quotes = pgTable('quotes', {
    id: uuid('id').primaryKey().defaultRandom(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    requestId: uuid('request_id').references(() => requests.id).notNull(), // Added direct link to request
    amount: integer('amount').notNull(), // in cents
    message: text('message'),
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
    isVirtual: boolean('is_virtual').default(false),
    hourlyRate: integer('hourly_rate'), // in cents
    fixedRate: integer('fixed_rate'), // in cents (for fixed-price services)
    availability: text('availability'), // "Weekends", "Evenings", etc.
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
    sliceId: uuid('slice_id').references(() => slices.id).notNull(),
    clientId: uuid('client_id').references(() => users.id).notNull(),
    providerId: uuid('provider_id').references(() => users.id).notNull(),
    totalAmount: integer('total_amount').notNull(), // slice price + 15% fee (in cents)
    sliceAmount: integer('slice_amount').notNull(), // actual slice price (in cents)
    platformFee: integer('platform_fee').notNull(), // 15% of slice price (in cents)
    communityRewardPool: integer('community_reward_pool').notNull(), // 3% of slice price (in cents)
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    mercadoPagoPreapprovalId: text('mercado_pago_preapproval_id'),
    status: paymentStatusEnum('status').default('pending_escrow'),
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
    mercadoPagoEmail: text('mercado_pago_email'),
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
