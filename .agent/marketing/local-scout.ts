/**
 * THE LOCAL SCOUT AGENT
 * 
 * This script simulates the "Umarel Scout" workflow locally.
 * It is designed to be run manually or via cron to search for leads.
 * 
 * Usage:
 * 1. Set environment variable OPENAI_API_KEY
 * 2. Run: npx tsx .agent/marketing/local-scout.ts
 * 
 * Note: Real Instagram API access requires complex setup. 
 * This script demonstrates the logic using a mock source or a placeholder for scraping.
 */

import 'dotenv/config';
import OpenAI from 'openai';

// --- Configuration ---
const KEYWORDS = ['albañil', 'remodelacion', 'humedad', 'plomero zona norte', 'busco arquitecto'];
const MOCK_MODE = true; // Set to false when you have real scraping logic

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY environment variable is not set.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface SocialPost {
    id: string;
    platform: 'Instagram' | 'Twitter' | 'Facebook';
    username: string;
    content: string;
    url: string;
    timestamp: Date;
}

interface AnalyzedLead extends SocialPost {
    intentScore: number; // 0-10
    reason: string;
    suggestedReply?: string;
}

// --- 1. The "Ear" (Source) ---
async function fetchRecentPosts(): Promise<SocialPost[]> {
    console.log('📡 Scanning for keywords:', KEYWORDS.join(', '));

    if (MOCK_MODE) {
        // Simulating finding posts with varying degrees of relevance
        return [
            {
                id: 'ig_123',
                platform: 'Instagram',
                username: 'maria_vecina',
                content: 'Alguien conoce un albañil de confianza en Palermo? Me cansé de que me dejen plantada. 😭 #reformas #caba',
                url: 'https://instagram.com/p/12345',
                timestamp: new Date()
            },
            {
                id: 'tw_456',
                platform: 'Twitter',
                username: 'construction_fan',
                content: 'Look at this amazing architecture in Buenos Aires! #art',
                url: 'https://twitter.com/status/456',
                timestamp: new Date()
            },
            {
                id: 'fb_789',
                platform: 'Facebook',
                username: 'juan_perez',
                content: 'Necesito presupuesto para arreglar humedad de cimientos. Urgente, zona Belgrano.',
                url: 'https://facebook.com/groups/123/posts/789',
                timestamp: new Date()
            },
            {
                id: 'fb_999',
                platform: 'Facebook',
                username: 'spam_bot',
                content: 'Gana dinero desde casa con inversiones crypto! #reformas',
                url: 'https://facebook.com/groups/spam/999',
                timestamp: new Date()
            }
        ];
    }

    // TODO: Implement real scraping or API calls here
    // e.g. using 'apify-client' or 'puppeteer'
    return [];
}

// --- 2. The "Brain" (Analysis) ---
async function analyzeIntent(post: SocialPost): Promise<AnalyzedLead> {
    // console.log(`🧠 Analyzing post by ${post.username}...`);

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using a cheaper/faster model for high volume
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant for a construction marketplace called "El Entendido" (elentendido.ar). 
                    Your goal is to identify high-intent leads who are looking for construction/home services in Argentina.
                    
                    Analyze the user post content.
                    Return a JSON object with:
                    - intentScore: number (0-10), where 10 is explicit urgent demand for service.
                    - reason: string (brief explanation).
                    - suggestedReply: string (a helpful, non-spammy comment in Spanish, max 200 chars).
                    
                    The reply should:
                    - Be empathetic to their problem (e.g. "Qué bajón lo de la humedad").
                    - Suggest "El Entendido" (elentendido.ar) as a safe solution because it holds funds until work is verified.
                    - NOT sound like a robot. Use local Argentine slang appropriately if the user does.
                    
                    If intentScore < 7, suggestingReply can be null.`
                },
                {
                    role: "user",
                    content: `Post Content: "${post.content}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');

        return {
            ...post,
            intentScore: result.intentScore || 0,
            reason: result.reason || "Analysis failed",
            suggestedReply: result.suggestedReply
        };

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        return {
            ...post,
            intentScore: 0,
            reason: "AI Error",
            suggestedReply: undefined
        };
    }
}

// --- 3. The "Hands" (Action) ---
async function saveLead(lead: AnalyzedLead) {
    console.log(`✅ HIGH INTENT DETECTED [Score ${lead.intentScore}]:`);
    console.log(`   User: ${lead.username} (${lead.platform})`);
    console.log(`   Post: "${lead.content}"`);
    console.log(`   Reason: ${lead.reason}`);
    console.log(`   📝 DRAFT REPLY: "${lead.suggestedReply}"`);
    console.log('---------------------------------------------------');
    // TODO: Append to Google Sheet or CSV
}

// --- Main Loop ---
async function run() {
    process.stdout.write('--- STARTING SCOUT AGENT ---\n');

    // 1. Fetch
    const posts = await fetchRecentPosts();
    process.stdout.write(`Found ${posts.length} potential posts. Analyzing with OpenAI...\n\n`);

    // 2. Analyze
    for (const post of posts) {
        const analyzed = await analyzeIntent(post);

        // 3. Filter & Act
        if (analyzed.intentScore >= 7) {
            await saveLead(analyzed);
        } else {
            // console.log(`⏭️  Skipping low intent post by ${post.username} (Score: ${analyzed.intentScore})`);
        }
    }

    process.stdout.write('\n--- SCAN COMPLETE ---\n');
}

run().catch(console.error);
