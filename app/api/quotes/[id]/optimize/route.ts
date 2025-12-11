import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotes, requests, slices, quoteItems, comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SYSTEM_PROMPT = `You are an expert Cost Efficiency Consultant for construction and digital services.
Your goal is to analyze a quote and suggest concrete ways to reduce cost or time while maintaining quality.

Input:
1. Original Request
2. Quote Details (Amount, Message, Delivery Date)
3. Included Slices (Scope of work)

Output:
Return a JSON object with a "suggestions" array. Each suggestion should be a clear, actionable tip.
Also return a "revisedQuote" object if you see obvious savings.

Example Output:
{
  "suggestions": [
    "Use a pre-built template for the landing page instead of custom design.",
    "Parallelize the backend and frontend development to reduce timeline."
  ],
  "potentialSavings": "15-20%"
}
`;

// Helper function to generate contextual optimization suggestions
function generateOptimizationSuggestions(quote: any, quoteSlices: any[], serviceRequest: any): string[] {
    const suggestions: string[] = [];
    const quoteAmountDollars = quote.amount / 100;
    const descLower = serviceRequest?.description?.toLowerCase() || '';
    const titleLower = serviceRequest?.title?.toLowerCase() || '';

    // Determine service type
    const isWebDev = /web|site|app|frontend|backend|ui|ux|react|next/.test(descLower + titleLower);
    const isConstruction = /build|renovate|construct|paint|install|repair|plumb/.test(descLower + titleLower);
    const isDesign = /design|mockup|wireframe|prototype|figma/.test(descLower + titleLower);

    // High-value quote suggestions (over $5000)
    if (quoteAmountDollars > 5000) {
        if (isWebDev) {
            suggestions.push("Consider using a pre-built template or starter kit to reduce initial development time by 30-40%.");
            suggestions.push("Implement features in phases (MVP first) to spread costs and validate assumptions early.");
        } else if (isConstruction) {
            suggestions.push("Source materials directly from wholesalers instead of retail to save 15-20% on material costs.");
            suggestions.push("Schedule work during off-peak season when contractor rates are typically 10-15% lower.");
        } else {
            suggestions.push("Break the project into smaller milestones to allow for budget adjustments between phases.");
        }
    }

    // Medium-value quote suggestions ($1000-$5000)
    if (quoteAmountDollars >= 1000 && quoteAmountDollars <= 5000) {
        if (isWebDev) {
            suggestions.push("Use open-source libraries and components to reduce custom development costs.");
            suggestions.push("Parallelize frontend and backend development to reduce overall timeline and costs.");
        } else if (isConstruction) {
            suggestions.push("Consider alternative materials that offer similar quality at a lower price point.");
            suggestions.push("Combine this project with future planned work to negotiate better bulk rates.");
        } else if (isDesign) {
            suggestions.push("Start with low-fidelity prototypes to validate concepts before investing in high-fidelity designs.");
            suggestions.push("Use stock photography and illustrations initially, replacing with custom assets in later phases.");
        }
    }

    // Low-value quote suggestions (under $1000)
    if (quoteAmountDollars < 1000) {
        suggestions.push("Focus on the core requirements first and add nice-to-have features in a future iteration.");
        if (isWebDev) {
            suggestions.push("Consider using no-code or low-code tools for rapid prototyping before full development.");
        }
    }

    // Scope-based suggestions
    if (quoteSlices.length > 5) {
        suggestions.push("The scope includes many slices. Prioritizing the top 3-4 critical items could reduce costs by 25-35%.");
    }

    // Timeline-based suggestions
    if (quote.estimatedDeliveryDate) {
        const daysUntilDelivery = Math.floor((new Date(quote.estimatedDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilDelivery < 7) {
            suggestions.push("The tight deadline may include rush fees. Extending by 1-2 weeks could reduce costs by 10-15%.");
        }
    }

    // General suggestions
    const generalSuggestions = [
        "Request itemized pricing to identify specific areas where costs can be optimized.",
        "Ask if there are alternative approaches that could achieve similar results at lower cost.",
        "Negotiate payment terms - some providers offer discounts for upfront payment."
    ];

    // Add 1-2 general suggestions if we don't have enough specific ones
    while (suggestions.length < 3 && generalSuggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * generalSuggestions.length);
        suggestions.push(generalSuggestions.splice(randomIndex, 1)[0]);
    }

    // Return 2-4 suggestions
    return suggestions.slice(0, 2 + Math.floor(Math.random() * 3));
}

// Helper function to calculate potential savings percentage
function calculatePotentialSavings(quoteAmount: number, numSlices: number): string {
    const quoteAmountDollars = quoteAmount / 100;

    // Base savings on quote amount
    let baseSavings = 5;
    if (quoteAmountDollars > 5000) {
        baseSavings = 15;
    } else if (quoteAmountDollars > 2000) {
        baseSavings = 10;
    }

    // Add bonus savings for complex projects (more slices = more optimization opportunities)
    const complexityBonus = Math.min(numSlices, 5);

    // Calculate final savings with some randomization
    const totalSavings = baseSavings + complexityBonus + Math.floor(Math.random() * 5);
    const minSavings = Math.max(5, totalSavings - 3);
    const maxSavings = totalSavings + 2;

    return `${minSavings}-${maxSavings}%`;
}


export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // quoteId
        const body = await request.json();
        const { userId } = body;

        // 1. Fetch Context
        const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
        if (!quote) {
            return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }

        const [serviceRequest] = await db.select().from(requests).where(eq(requests.id, quote.requestId));

        // Get slices included in this quote
        const includedItems = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, id));
        const includedSliceIds = includedItems.map(item => item.sliceId);

        let quoteSlices: any[] = [];
        if (includedSliceIds.length > 0) {
            // Drizzle doesn't have a simple "where in" for array of uuids without helper, 
            // but we can fetch all and filter or use multiple queries. 
            // For simplicity/speed in this demo, let's fetch all slices for the request and filter.
            const allSlices = await db.select().from(slices).where(eq(slices.requestId, quote.requestId));
            quoteSlices = allSlices.filter(s => includedSliceIds.includes(s.id));
        }

        // 2. Construct LLM Input
        const context = `
        Request: ${serviceRequest.title} - ${serviceRequest.description}
        
        Quote Amount: $${quote.amount / 100}
        Quote Message: ${quote.message}
        
        Scope (Slices):
        ${quoteSlices.map(s => `- ${s.title}: ${s.description} (${s.estimatedEffort})`).join('\n')}
        `;

        // 3. Call LLM (Mocking)
        console.log("Calling Optimization LLM with context:", context);

        // ENHANCED MOCK RESPONSE - Contextually aware
        const suggestions = generateOptimizationSuggestions(quote, quoteSlices, serviceRequest);
        const potentialSavings = calculatePotentialSavings(quote.amount, quoteSlices.length);

        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

        // 4. Save Suggestions as Comments with varied messaging styles
        const introMessages = [
            "I've analyzed this quote and found some optimization opportunities:",
            "Here are some ways to potentially reduce costs while maintaining quality:",
            "After reviewing the quote details, I have a few suggestions:",
            "Let me share some cost-optimization strategies for this quote:",
            "I've identified several areas where you might achieve better value:"
        ];

        const outroMessages = [
            `\n\n💰 **Estimated Savings:** ${potentialSavings}`,
            `\n\n📊 **Potential Cost Reduction:** ${potentialSavings}`,
            `\n\n✨ **Expected Savings Range:** ${potentialSavings}`,
            `\n\n🎯 **Target Savings:** ${potentialSavings}`
        ];

        const intro = introMessages[Math.floor(Math.random() * introMessages.length)];
        const outro = outroMessages[Math.floor(Math.random() * outroMessages.length)];

        const commentContent = `**AI Quote Optimization**\n\n${intro}\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n')}${outro}\n\n*These are suggestions based on common optimization patterns. Always verify with your provider before making changes.*`;

        const [newComment] = await db.insert(comments).values({
            requestId: quote.requestId,
            quoteId: id, // Link to specific quote
            userId: userId, // System/AI user
            content: commentContent,
            type: 'ai_response',
            isAiGenerated: true,
        }).returning();

        return NextResponse.json({
            comment: newComment,
            suggestions: { suggestions, potentialSavings }
        });

    } catch (error) {
        console.error('Error optimizing quote:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
