
import { createGoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';

// Define strict interfaces for the consensus result
export interface ConsensusResult {
    isSafe: boolean;
    confidenceScore: number; // 0-100
    consensusReached: boolean;
    flaggedCategory?: 'harassment' | 'hate_speech' | 'dangerous_content' | 'scam' | 'none';
    sanitizedContent?: string; // Optional rewording if mostly safe but needs polish
    reasoning: string;
}

// --------------------------------------------------------
// MODEL 1: GEMINI (The Speed/Context Specialist)
// --------------------------------------------------------
async function analyzeWithGemini(content: string, contextType: string): Promise<ConsensusResult> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

        // Mock implementation for now (Real call would go here)
        // In production, instantiate GoogleGenerativeAI and call generateContent

        // Simulated Logic:
        const isSafe = !content.toLowerCase().includes('scam') && !content.toLowerCase().includes('hate');

        return {
            isSafe,
            confidenceScore: isSafe ? 95 : 80,
            consensusReached: true,
            flaggedCategory: isSafe ? 'none' : 'scam',
            reasoning: isSafe ? "Content appears helpful and on-topic." : "Potentially harmful keyword detected."
        };
    } catch (e) {
        console.error("Gemini Analysis Failed:", e);
        return { isSafe: true, confidenceScore: 0, consensusReached: false, reasoning: "Analysis failed" };
    }
}

// --------------------------------------------------------
// MODEL 2: OPENAI (The Reasoning/Logic Specialist)
// --------------------------------------------------------
async function analyzeWithOpenAI(content: string, contextType: string): Promise<ConsensusResult> {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

        // Mock implementation for now

        const isSafe = !content.toLowerCase().includes('steal') && !content.toLowerCase().includes('kill');

        return {
            isSafe,
            confidenceScore: isSafe ? 90 : 85,
            consensusReached: true,
            flaggedCategory: isSafe ? 'none' : 'dangerous_content',
            reasoning: isSafe ? "No policy violations found." : "Dangerous vocabulary detected."
        };
    } catch (e) {
        console.error("OpenAI Analysis Failed:", e);
        return { isSafe: true, confidenceScore: 0, consensusReached: false, reasoning: "Analysis failed" };
    }
}

// --------------------------------------------------------
// THE CONSENSUS ENGINE
// --------------------------------------------------------
export async function runConsensusFilter(
    content: string,
    context: 'quote_feedback' | 'project_comment' | 'general' = 'general'
): Promise<ConsensusResult> {

    // 1. Run Parallel Analysis
    const [geminiResult, openAiResult] = await Promise.all([
        analyzeWithGemini(content, context),
        analyzeWithOpenAI(content, context)
    ]);

    // 2. Evaluate Consensus
    // If BOTH say safe => ALLOW
    if (geminiResult.isSafe && openAiResult.isSafe) {
        return {
            isSafe: true,
            confidenceScore: (geminiResult.confidenceScore + openAiResult.confidenceScore) / 2,
            consensusReached: true,
            flaggedCategory: 'none',
            reasoning: `Consensus Reached. Gemini: ${geminiResult.reasoning} | OpenAI: ${openAiResult.reasoning}`
        };
    }

    // If BOTH say unsafe => BLOCK
    if (!geminiResult.isSafe && !openAiResult.isSafe) {
        return {
            isSafe: false,
            confidenceScore: Math.max(geminiResult.confidenceScore, openAiResult.confidenceScore),
            consensusReached: true,
            flaggedCategory: geminiResult.flaggedCategory, // Prioritize Gemini's classification
            reasoning: "Both models flagged this content as unsafe."
        };
    }

    // If SPLIT DECISION => BLOCK (Safety First Policy)
    // Or send to human review queue (future feature)
    return {
        isSafe: false,
        confidenceScore: 50,
        consensusReached: false, // Disagreement
        flaggedCategory: 'scam', // Default to caution
        reasoning: `Models Disagree. Gemini Safe: ${geminiResult.isSafe}, OpenAI Safe: ${openAiResult.isSafe}. Blocked for safety.`
    };
}
