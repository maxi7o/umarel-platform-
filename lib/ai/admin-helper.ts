
import { openai } from './openai';

interface DisputeAnalysisInput {
    disputeId: string;
    requestTitle: string;
    requestDescription: string;
    sliceTitle: string;
    sliceDescription: string;
    evidenceUrls: string[];
    disputeReason: string;
}

export interface DisputeAnalysisResult {
    recommendation: 'release_to_provider' | 'refund_client' | 'escalate_to_human';
    confidenceScore: number; // 0-100
    reasoning: string;
    keyObservations: string[];
}

export async function analyzeDispute(input: DisputeAnalysisInput): Promise<DisputeAnalysisResult> {
    console.log(`[AI Admin] Analyzing dispute ${input.disputeId}...`);

    // Construct the user message with text and images
    const userContent: any[] = [
        {
            type: "text",
            text: `
            CONTEXT:
            Project Request: ${input.requestTitle} - ${input.requestDescription}
            Specific Slice (Task): ${input.sliceTitle} - ${input.sliceDescription}
            
            DISPUTE:
            Client refused payment. 
            Reason given: "${input.disputeReason}"
            
            EVIDENCE:
            The provider submitted the attached photos as proof of work.
            
            TASK:
            Analyze the images. Do they visually confirm that the "Specific Slice" was completed as described?
            Does the evidence contradict the Client's dispute reason?
            `
        }
    ];

    // Add images to the message
    input.evidenceUrls.forEach(url => {
        userContent.push({
            type: "image_url",
            image_url: {
                url: url
            }
        });
    });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Using Vision model
            messages: [
                {
                    role: "system",
                    content: `You are an impartial Dispute Resolution Arbiter for a construction marketplace.
Your job is to look at "Proof of Work" photos and decide if the job was done according to the description.

Output valid JSON:
{
  "recommendation": "release_to_provider" | "refund_client" | "escalate_to_human",
  "confidenceScore": number (0-100),
  "reasoning": "Concise explanation of why...",
  "keyObservations": ["List of things seen in image..."]
}`
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content || '{}';
        const result = JSON.parse(content);

        return {
            recommendation: result.recommendation || 'escalate_to_human',
            confidenceScore: result.confidenceScore || 0,
            reasoning: result.reasoning || "AI could not determine outcome.",
            keyObservations: result.keyObservations || []
        };

    } catch (error) {
        console.error("AI Dispute Analysis Failed:", error);
        return {
            recommendation: 'escalate_to_human',
            confidenceScore: 0,
            reasoning: "AI analysis failed due to technical error.",
            keyObservations: []
        };
    }
}
