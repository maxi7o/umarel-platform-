
import { openai } from './openai'; // Reusing existing client

export type DisputeResolution = 'release_funds' | 'refund_client' | 'split_50_50' | 'manual_review';
export type InsightSignal = 'adapt' | 'persevere' | 'noise';

export interface DisputeAnalysis {
    resolution: DisputeResolution;
    confidence: number;
    reasoning: string;
    productInsight: {
        signal: InsightSignal;
        featureArea: string; // e.g. "Auto-Assign", "Payment Flow", "Wizard"
        insight: string; // "Users misunderstand the auto-assign criteria..."
    } | null;
}

/**
 * The Judge: Analyzes a dispute to recommend a resolution AND extract product feedback.
 */
export async function analyzeDispute(
    sliceContext: any,
    disputeClaim: { reason: string; description: string; evidenceDescription?: string }
): Promise<DisputeAnalysis> {

    const systemPrompt = `You are "The Judge" - an impartial mediator and Product Manager for Umarel (a home services marketplace).

GOALS:
1. Recommend a fair resolution for a dispute between a Client and a Provider.
2. **CRITICAL**: Analyze if this dispute reveals a flaw in the Product/Platform (Feature Gap, Confusing UI, Bad Process).
   - If the platform failed the users, signal "ADAPT" and name the feature.
   - If the platform worked but users misbehaved, signal "PERSEVERE".
   - If it's just a random noise/misunderstanding, signal "NOISE".

CONTEXT:
Slice Title: "${sliceContext.title}"
Price: ${sliceContext.finalPrice} cents
Status: ${sliceContext.status}
Provider ID: ${sliceContext.assignedProviderId}
Client ID: ${sliceContext.creatorId}

DISPUTE CLAIM (File by Client):
Reason: ${disputeClaim.reason}
Description: "${disputeClaim.description}"
Evidence: "${disputeClaim.evidenceDescription || 'None'}"

OUTPUT FORMAT (JSON):
{
  "resolution": "release_funds" | "refund_client" | "split_50_50" | "manual_review",
  "confidence": 0-100,
  "reasoning": "Brief explanation...",
  "productInsight": {
    "signal": "adapt" | "persevere" | "noise",
    "featureArea": "Short feature name (e.g. 'Wizard', 'Escrow', 'Chat')",
    "insight": "One sentence explaining the product takeaway."
  }
}
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // Use smart model for reasoning
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Please analyze this case." }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2 // Low temp for consistent outcomes
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content) as DisputeAnalysis;

    } catch (error) {
        console.error("AI Judge Error:", error);
        // Fallback safety
        return {
            resolution: 'manual_review',
            confidence: 0,
            reasoning: "AI Analysis Failed",
            productInsight: null
        };
    }
}
