/**
 * THE LOCAL SCOUT AGENT
 * 
 * This script simulates the "Umarel Scout" workflow locally.
 * It is designed to be run manually or via cron to search for leads.
 * 
 * Usage:
 * 1. Set environment variable OPENAI_API_KEY
 * 2. Run: npx ts-node .agent/marketing/local-scout.ts
 * 
 * Note: Real Instagram API access requires complex setup. 
 * This script demonstrates the logic using a mock source or a placeholder for scraping.
 */

import 'dotenv/config';

// --- Configuration ---
const KEYWORDS = ['albañil', 'remodelacion', 'humedad', 'plomero zona norte', 'busco arquitecto'];
const MOCK_MODE = true; // Set to false when you have real scraping logic

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
        // Simulating finding posts
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
                content: 'Necesito presupuesto para arreglar humedad de cimientos. Urgente.',
                url: 'https://facebook.com/groups/123/posts/789',
                timestamp: new Date()
            }
        ];
    }

    // TODO: Implement real scraping or API calls here
    // e.g. using 'apify-client' or 'puppeteer'
    return [];
}

// --- 2. The "Brain" (Analysis) ---
// Mocking OpenAI call for simplicity in this demo file.
// In production, import OpenAI from 'openai' and call the API.
async function analyzeIntent(post: SocialPost): Promise<AnalyzedLead> {
    console.log(`🧠 Analyzing post by ${post.username}...`);

    let score = 0;
    let reason = "Low relevance";
    let reply = undefined;

    const lowerContent = post.content.toLowerCase();

    // Simple heuristic "AI"
    if (lowerContent.includes('necesito') || lowerContent.includes('busco') || lowerContent.includes('alguien conoce')) {
        score = 8;
        reason = "Explicit demand for service";
        reply = "Hola! Si buscás confianza, fijate en elentendido.ar. Podés congelar el pago hasta que el trabajo esté terminado. Es más seguro para ambos!";
    } else if (lowerContent.includes('presupuesto')) {
        score = 9;
        reason = "High intent (budget)";
        reply = "Para presupuestos serios, te recomiendo elentendido.ar. Los expertos ahí tienen su identidad validada.";
    }

    return {
        ...post,
        intentScore: score,
        reason,
        suggestedReply: reply
    };
}

// --- 3. The "Hands" (Action) ---
async function saveLead(lead: AnalyzedLead) {
    console.log(`✅ HIGH INTENT DETECTED [Score ${lead.intentScore}]:`);
    console.log(`   User: ${lead.username}`);
    console.log(`   Post: "${lead.content}"`);
    console.log(`   Reason: ${lead.reason}`);
    console.log(`   DRAFT REPLY: "${lead.suggestedReply}"`);
    console.log(`   [Action] Saved to leads database (Mock)`);
    console.log('---------------------------------------------------');
    // TODO: Append to Google Sheet or CSV
}

// --- Main Loop ---
async function run() {
    console.log('--- STARTING SCOUT AGENT ---');

    // 1. Fetch
    const posts = await fetchRecentPosts();
    console.log(`Found ${posts.length} potential posts.`);

    // 2. Analyze
    for (const post of posts) {
        const analyzed = await analyzeIntent(post);

        // 3. Filter & Act
        if (analyzed.intentScore >= 7) {
            await saveLead(analyzed);
        } else {
            console.log(`⏭️  Skipping low intent post by ${post.username} (Score: ${analyzed.intentScore})`);
        }
    }

    console.log('--- SCAN COMPLETE ---');
}

run().catch(console.error);
