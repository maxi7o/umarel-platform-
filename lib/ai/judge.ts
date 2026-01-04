import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

export type ModelVerdict = {
    model: string;
    decision: 'resolved_release' | 'resolved_refund' | 'resolved_partial' | 'appealed';
    confidence: number;
    reasoning: string;
    keyObservations: string[];
    suggestedSplit?: { provider: number; client: number }; // Percentage 0-100
};

export type CouncilVerdict = {
    consensus: ModelVerdict['decision'] | 'split_decision';
    verdicts: ModelVerdict[];
    summary: string;
}

// ------------------------------------------
// 1. OpenAI Implementation (GPT-4o)
// ------------------------------------------
async function judgeWithOpenAI(
    contractText: string,
    imageUrls: string[],
    precedents: string[]
): Promise<ModelVerdict> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are 'Umarel', a highly experienced, strict, and impartial construction supervisor acting as a dispute judge.
                    
                    TASK:
                    Analyze the provided photos of the work against the contractual agreement. Determine if the funds should be released to the Provider, refunded to the Client, or split.
                    
                    CRITICAL: Apply the following ESTABLISHED PRECEDENTS (User Refinements) to your judgment:
                    ${precedents.length > 0 ? precedents.slice(-15).map(p => `- ${p}`).join('\n') : 'No specific precedents.'}
                    (Prioritize recent precedents)

                    CRITICAL: "THE 1-METER RULE" (Reasonableness):
                    - Construction is manual work, not semiconductor manufacturing.
                    - REJECT "Pixel Peeping". If a flaw is only visible in a macro photo and not from a standard viewing distance (1 meter), it is ACCEPTABLE.
                    - Ignore microscopic brushstrokes unless they create a texture that looks bad from 1 meter away.
                    
                    CRITICAL: EVIDENCE QUALITY GATE (Due Diligence):
                    - If the photos are blurry, too dark, or do not clearly show the disputed area:
                    - You MUST return 'appealed' with reasoning: "Evidence quality insufficient for fair judgment."
                    - This proves we (the platform) are acting with "Responsabilidad de Medios" by not guessing.
                    
                    DECISION LOGIC:
                    - 'resolved_release': The work is complete and professional. Small imperfections are acceptable (Passes 1-Meter Rule).
                    - 'resolved_refund': The work is incomplete, damaged, or poor quality (Fails 1-Meter Rule).
                    - 'resolved_partial': The work is mostly done but has minor 'finishing' (Terminaciones) issues. Suggest a fair discount (e.g. 10-20% refund).
                    - 'appealed': The evidence is inconclusive or low quality.

                    OUTPUT JSON FORMAT:
                    {
                        "decision": "resolved_release" | "resolved_refund" | "resolved_partial" | "appealed",
                        "confidence": number, // 0-100
                        "reasoning": "Clear, concise explanation...",
                        "keyObservations": ["List", "of", "facts"],
                        "suggestedSplit": { "provider": 80, "client": 20 } // Required if decision is resolved_partial
                    }
                    `
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: contractText },
                        ...imageUrls.map(url => ({ type: "image_url" as const, image_url: { url } }))
                    ]
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        const decision = validateDecision(result.decision);

        return {
            model: 'GPT-4o',
            decision: decision,
            confidence: result.confidence || 0,
            reasoning: result.reasoning || "No reasoning provided.",
            keyObservations: result.keyObservations || [],
            suggestedSplit: result.suggestedSplit
        };
    } catch (e) {
        console.error("OpenAI Error", e);
        return createErrorVerdict('GPT-4o');
    }
}

// ------------------------------------------
// 2. Google Gemini Implementation (1.5 Pro)
// ------------------------------------------
async function judgeWithGemini(
    contractText: string,
    imageUrls: string[],
    precedents: string[]
): Promise<ModelVerdict> {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_KEY) {
            return { model: 'Gemini 1.5 Pro', decision: 'appealed', confidence: 0, reasoning: 'Model Key Missing', keyObservations: [] };
        }

        // 1. Fetch and process images
        const imageParts = await Promise.all(
            imageUrls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
                    const arrayBuffer = await response.arrayBuffer();
                    return {
                        inlineData: {
                            data: Buffer.from(arrayBuffer).toString("base64"),
                            mimeType: response.headers.get("content-type") || "image/jpeg",
                        },
                    };
                } catch (err) {
                    console.error(`Failed to load image for Gemini: ${url}`, err);
                    return null;
                }
            })
        );

        const validImages = imageParts.filter(part => part !== null) as { inlineData: { data: string; mimeType: string } }[];

        if (validImages.length === 0) {
            return { model: 'Gemini 1.5 Pro', decision: 'appealed', confidence: 0, reasoning: 'Failed to load evidence images for analysis.', keyObservations: [] };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
        You are 'Umarel', a highly experienced, strict, and impartial construction supervisor acting as a dispute judge.

        TASK:
        Analyze the provided photos of the work against the contractual agreement. Determine if the funds should be released to the Provider, refunded to the Client, or split.

        CRITICAL: Apply the following ESTABLISHED PRECEDENTS (User Refinements) to your judgment:
        ${precedents.length > 0 ? precedents.slice(-15).map(p => `- ${p}`).join('\n') : 'No specific precedents.'}
        (Prioritize recent precedents)

        CRITICAL: "THE 1-METER RULE" (Reasonableness):
        - Construction is manual work, not semiconductor manufacturing.
        - REJECT "Pixel Peeping". If a flaw is only visible in a macro photo and not from a standard viewing distance (1 meter), it is ACCEPTABLE.
        - Ignore microscopic brushstrokes unless they create a texture that looks bad from 1 meter away.

        CRITICAL: EVIDENCE QUALITY GATE (Due Diligence):
        - If the photos are blurry, too dark, or do not clearly show the disputed area:
        - You MUST return 'appealed' with reasoning: "Evidence quality insufficient for fair judgment."
        - This proves we (the platform) are acting with "Responsabilidad de Medios" by not guessing.

        DECISION LOGIC:
        - 'resolved_release': The work is complete and professional. Small imperfections are acceptable (Passes 1-Meter Rule).
        - 'resolved_refund': The work is incomplete, damaged, or poor quality (Fails 1-Meter Rule).
        - 'resolved_partial': The work is mostly done but has minor 'finishing' (Terminaciones) issues. Suggest a fair discount (e.g. 10-20% refund).
        - 'appealed': The evidence is inconclusive or low quality.

        OUTPUT JSON FORMAT (Return ONLY raw JSON, no markdown):
        {
            "decision": "resolved_release" | "resolved_refund" | "resolved_partial" | "appealed",
            "confidence": number, // 0-100
            "reasoning": "Clear, concise explanation...",
            "keyObservations": ["List", "of", "facts"],
            "suggestedSplit": { "provider": 80, "client": 20 }
        }

        CONTRACT DETAILS:
        ${contractText}
        `;

        const result = await model.generateContent([
            prompt,
            ...validImages
        ]);

        const responseText = result.response.text();

        // Clean markdown if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        return {
            model: 'Gemini 1.5 Pro',
            decision: parsed.decision,
            confidence: parsed.confidence,
            reasoning: parsed.reasoning,
            keyObservations: parsed.keyObservations || [],
            suggestedSplit: parsed.suggestedSplit
        };

    } catch (e) {
        console.error("Gemini Error", e);
        return createErrorVerdict('Gemini 1.5 Pro');
    }
}

// ------------------------------------------
// ORCHESTRATOR
// ------------------------------------------
export async function judgeDisputeParallel(
    contract: { title: string; description: string; price: number; currency: string; criteria?: string },
    evidence: { url: string; type: 'image' | 'video' }[],
    knownPrecedents: string[] = [] // User Refinement Criteria
): Promise<CouncilVerdict> {

    // Filter Media
    const imageUrls = evidence.filter(e => e.type === 'image').map(e => e.url);
    const contractText = `CONTRACT DETAILS: Task: ${contract.title}. Description: ${contract.description}. Acceptance Criteria: ${contract.criteria || 'Standard professional finish (Terminaciones)'}. Value: ${contract.currency} ${contract.price}`;

    if (imageUrls.length === 0) {
        return { consensus: 'appealed', verdicts: [], summary: "No visual evidence provided for AI analysis." };
    }

    // RUN PARALLEL
    const results = await Promise.all([
        judgeWithOpenAI(contractText, imageUrls, knownPrecedents),
        judgeWithGemini(contractText, imageUrls, knownPrecedents)
    ]);

    // CONSENSUS LOGIC
    const activeVerdicts = results.filter(v => v.reasoning !== 'Model Key Missing' && v.reasoning !== 'Image Fetcher Not Implemented' && v.decision !== 'appealed');

    if (activeVerdicts.length === 0) {
        return {
            consensus: 'appealed',
            verdicts: results,
            summary: "Models inconclusive or failed."
        };
    }

    const votes = activeVerdicts.map(r => r.decision);
    const releaseVotes = votes.filter(v => v === 'resolved_release').length;
    const refundVotes = votes.filter(v => v === 'resolved_refund').length;
    const partialVotes = votes.filter(v => v === 'resolved_partial').length;

    let consensus: CouncilVerdict['consensus'] = 'split_decision';

    // Consensus thresholds
    const majority = Math.ceil(activeVerdicts.length / 2);

    if (releaseVotes >= majority) consensus = 'resolved_release';
    else if (refundVotes >= majority) consensus = 'resolved_refund';
    else if (partialVotes >= majority) consensus = 'resolved_partial';
    else if (activeVerdicts.length === 1) consensus = activeVerdicts[0].decision;
    else consensus = 'split_decision';

    return {
        consensus,
        verdicts: results,
        summary: `Council executed with ${results.length} models. ${activeVerdicts.length} active. Result: ${consensus}`
    };
}

// Helpers
function validateDecision(d: string): ModelVerdict['decision'] {
    if (['resolved_release', 'resolved_refund', 'resolved_partial', 'appealed'].includes(d)) return d as any;
    return 'appealed';
}

function createErrorVerdict(model: string): ModelVerdict {
    return { model, decision: 'appealed', confidence: 0, reasoning: "Model execution error.", keyObservations: [] };
}
