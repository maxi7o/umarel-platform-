import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requests, slices, comments } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

const SYSTEM_PROMPT = `You are an expert Project Manager and Technical Architect.
Your goal is to break down a service request into clear, actionable, and independently deliverable "slices" of work.
A "slice" is a small, testable unit of value.

Input:
1. Original Service Request (Title, Description)
2. Conversation History (Comments, Prompts)
3. Specific User Instruction (The prompt that triggered this)

Output:
Return a JSON object with a "slices" array. Each slice must have:
- title: Short, action-oriented title
- description: Detailed acceptance criteria and scope
- estimatedEffort: e.g. "2 hours", "1 day"
- requiredSkills: Array of strings (e.g. ["React", "Figma"])
- dependencies: Array of indices of other slices in this list that must be done first (optional)

Example Output:
{
  "slices": [
    {
      "title": "Design Database Schema",
      "description": "Create ERD and Prisma schema for users and posts.",
      "estimatedEffort": "4 hours",
      "requiredSkills": ["Database Design", "Prisma"],
      "dependencies": []
    }
  ]
}
`;

// Helper function to generate contextual slices based on the request and prompt
function generateContextualSlices(serviceRequest: any, prompt: string) {
    const promptLower = prompt.toLowerCase();
    const descLower = serviceRequest.description?.toLowerCase() || '';
    const titleLower = serviceRequest.title?.toLowerCase() || '';

    // Edge case: Detect if user is asking a question rather than requesting slicing
    const isQuestion = /^(what|how|why|when|where|who|can you|could you|would you|is it|are there|do you)\s/i.test(prompt.trim());
    const isVague = prompt.trim().length < 10 || /^(help|please|thanks|ok|yes|no)$/i.test(prompt.trim());

    // If it's clearly a question or too vague, return empty array (will be handled specially)
    if (isQuestion || isVague) {
        return null; // Signal that this needs a conversational response instead
    }

    // Determine the type of work based on keywords
    const isWebDev = /web|site|app|frontend|backend|ui|ux|react|next/.test(descLower + titleLower);
    const isConstruction = /build|renovate|construct|paint|install|repair|plumb/.test(descLower + titleLower);
    const isDesign = /design|mockup|wireframe|prototype|figma/.test(descLower + titleLower);

    // Determine complexity based on prompt
    const wantsDetailed = /detail|break down|split|granular|step/.test(promptLower);
    const wantsQuick = /quick|simple|basic|overview/.test(promptLower);

    // Generate appropriate number of slices
    const numSlices = wantsDetailed ? (3 + Math.floor(Math.random() * 3)) : (2 + Math.floor(Math.random() * 2));

    const slices = [];

    if (isConstruction) {
        const constructionTasks = [
            { title: "Site Preparation & Protection", desc: "Protect existing fixtures and prepare work area. Set up dust barriers if needed.", effort: "2-3 hours", skills: ["General Labor"] },
            { title: "Demolition & Removal", desc: "Remove old materials, fixtures, and finishes. Dispose of debris properly.", effort: "4-6 hours", skills: ["Demolition", "Waste Management"] },
            { title: "Structural Assessment", desc: "Inspect walls, floors, and plumbing for any issues that need addressing.", effort: "1-2 hours", skills: ["Inspection", "Structural"] },
            { title: "Plumbing Rough-In", desc: "Update or relocate plumbing lines as needed for new fixtures.", effort: "4-8 hours", skills: ["Plumbing"] },
            { title: "Electrical Work", desc: "Install or update electrical outlets, lighting, and ventilation.", effort: "3-5 hours", skills: ["Electrical"] },
            { title: "Surface Preparation", desc: "Repair and prepare walls and floors for new finishes.", effort: "4-6 hours", skills: ["Drywall", "Surface Prep"] },
            { title: "Installation of Fixtures", desc: "Install new sink, toilet, shower, or other fixtures.", effort: "4-6 hours", skills: ["Plumbing", "Installation"] },
            { title: "Tiling & Finishing", desc: "Install new tiles on walls and/or floors with proper waterproofing.", effort: "1-2 days", skills: ["Tiling", "Waterproofing"] },
            { title: "Painting & Final Touches", desc: "Paint walls, install accessories, and perform final cleanup.", effort: "4-6 hours", skills: ["Painting", "Finishing"] }
        ];

        for (let i = 0; i < Math.min(numSlices, constructionTasks.length); i++) {
            const task = constructionTasks[i];
            slices.push({
                title: task.title,
                description: task.desc,
                estimatedEffort: task.effort,
                requiredSkills: task.skills,
                dependencies: i > 0 ? [i - 1] : []
            });
        }
    } else if (isWebDev) {
        const webDevTasks = [
            { title: "Requirements Analysis", desc: "Document functional and technical requirements, user stories, and acceptance criteria.", effort: "2-4 hours", skills: ["Analysis", "Documentation"] },
            { title: "Database Schema Design", desc: "Design data models, relationships, and create migration scripts.", effort: "3-5 hours", skills: ["Database Design", "SQL"] },
            { title: "UI/UX Wireframes", desc: "Create wireframes and user flow diagrams for key pages.", effort: "4-6 hours", skills: ["UI/UX", "Figma"] },
            { title: "Backend API Development", desc: "Implement REST/GraphQL endpoints with authentication and validation.", effort: "1-2 days", skills: ["Backend", "Node.js", "API Design"] },
            { title: "Frontend Component Library", desc: "Build reusable React components following design system.", effort: "1-2 days", skills: ["React", "TypeScript", "CSS"] },
            { title: "Integration & State Management", desc: "Connect frontend to backend, implement state management solution.", effort: "6-8 hours", skills: ["React", "API Integration"] },
            { title: "Testing & QA", desc: "Write unit tests, integration tests, and perform manual QA.", effort: "4-6 hours", skills: ["Testing", "Jest", "QA"] },
            { title: "Deployment Setup", desc: "Configure CI/CD, hosting, and monitoring infrastructure.", effort: "3-4 hours", skills: ["DevOps", "CI/CD"] }
        ];

        for (let i = 0; i < Math.min(numSlices, webDevTasks.length); i++) {
            const task = webDevTasks[i];
            slices.push({
                title: task.title,
                description: task.desc,
                estimatedEffort: task.effort,
                requiredSkills: task.skills,
                dependencies: i > 1 ? [i - 1] : []
            });
        }
    } else if (isDesign) {
        const designTasks = [
            { title: "Design Research & Moodboard", desc: "Research competitors, gather inspiration, create moodboard.", effort: "2-3 hours", skills: ["Research", "Design"] },
            { title: "Low-Fidelity Wireframes", desc: "Create basic wireframes to establish layout and flow.", effort: "3-4 hours", skills: ["Wireframing", "Figma"] },
            { title: "High-Fidelity Mockups", desc: "Design polished mockups with colors, typography, and imagery.", effort: "6-8 hours", skills: ["UI Design", "Figma"] },
            { title: "Interactive Prototype", desc: "Build clickable prototype to demonstrate user flows.", effort: "3-4 hours", skills: ["Prototyping", "Figma"] },
            { title: "Design System Documentation", desc: "Document components, styles, and usage guidelines.", effort: "2-3 hours", skills: ["Documentation", "Design Systems"] }
        ];

        for (let i = 0; i < Math.min(numSlices, designTasks.length); i++) {
            const task = designTasks[i];
            slices.push({
                title: task.title,
                description: task.desc,
                estimatedEffort: task.effort,
                requiredSkills: task.skills,
                dependencies: i > 0 ? [i - 1] : []
            });
        }
    } else {
        // Generic tasks for unknown domains
        const genericTasks = [
            { title: "Initial Assessment", desc: "Review requirements and create detailed project scope.", effort: "2-3 hours", skills: ["Analysis"] },
            { title: "Planning & Design", desc: "Create implementation plan and design approach.", effort: "4-6 hours", skills: ["Planning", "Design"] },
            { title: "Core Implementation", desc: "Build the main functionality according to specifications.", effort: "1-2 days", skills: ["Implementation"] },
            { title: "Testing & Refinement", desc: "Test thoroughly and refine based on feedback.", effort: "4-6 hours", skills: ["Testing", "QA"] },
            { title: "Documentation & Delivery", desc: "Create documentation and prepare final deliverables.", effort: "2-3 hours", skills: ["Documentation"] }
        ];

        for (let i = 0; i < Math.min(numSlices, genericTasks.length); i++) {
            const task = genericTasks[i];
            slices.push({
                title: task.title,
                description: task.desc,
                estimatedEffort: task.effort,
                requiredSkills: task.skills,
                dependencies: i > 0 && i < genericTasks.length - 1 ? [i - 1] : []
            });
        }
    }

    return slices;
}



export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { prompt, userId } = body;

        // 1. Fetch Context
        const [serviceRequest] = await db.select().from(requests).where(eq(requests.id, id));
        if (!serviceRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const previousComments = await db
            .select()
            .from(comments)
            .where(eq(comments.requestId, id))
            .orderBy(desc(comments.createdAt))
            .limit(10); // Limit context window

        // 2. Construct LLM Input
        const context = `
        Request Title: ${serviceRequest.title}
        Request Description: ${serviceRequest.description}
        
        Recent Conversation:
        ${previousComments.map(c => `${c.type}: ${c.content}`).join('\n')}
        
        User Instruction: ${prompt}
        `;

        // 3. Call LLM (Mocking OpenRouter/Grok call for now, replace with actual fetch)
        // In a real implementation, use fetch('https://openrouter.ai/api/v1/chat/completions', ...)
        console.log("Calling LLM with context:", context);

        // ENHANCED MOCK RESPONSE - Contextually aware based on prompt
        const mockSlices = generateContextualSlices(serviceRequest, prompt);

        // Handle edge case: question or vague prompt
        if (mockSlices === null) {
            // Simulate AI delay
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

            const helpfulResponses = [
                "I'm here to help break down your project into actionable tasks! To generate slices, try prompts like:\n\n• 'Break this down into phases'\n• 'What are the key tasks needed?'\n• 'Split this into smaller deliverables'\n\nOr feel free to ask me questions about the project - I'm happy to discuss!",
                "I'd be happy to help! For task slicing, I need a bit more context. You can:\n\n• Ask me to 'create a breakdown of tasks'\n• Request 'detailed project phases'\n• Or simply ask questions about the project scope\n\nWhat would be most helpful for you?",
                "I can help in two ways:\n\n1. **Generate task slices** - Use prompts like 'break this down' or 'create phases'\n2. **Answer questions** - Ask me anything about the project\n\nWhat would you like me to do?"
            ];

            const conversationalResponse = helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)];

            const [aiComment] = await db.insert(comments).values({
                requestId: id,
                userId: userId,
                content: conversationalResponse,
                type: 'ai_response',
                isAiGenerated: true,
            }).returning();

            return NextResponse.json({
                slices: [],
                comment: aiComment
            });
        }

        // Simulate AI delay (varied based on complexity)
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // 4. Save Slices to DB
        const createdSlices = [];
        for (const slice of mockSlices) {
            const [newSlice] = await db.insert(slices).values({
                requestId: id,
                creatorId: userId, // The user who prompted creates the slices (or a system bot user)
                title: slice.title,
                description: slice.description,
                estimatedEffort: slice.estimatedEffort,
                status: 'proposed',
                isAiGenerated: true,
                dependencies: slice.dependencies,
            }).returning();
            createdSlices.push(newSlice);
        }

        // 5. Save AI Response as a Comment with varied messaging
        const aiMessages = [
            `I've analyzed your request and generated ${createdSlices.length} actionable slices. Each slice represents an independently deliverable unit of work with clear acceptance criteria.`,
            `Great! I've broken this down into ${createdSlices.length} distinct work packages. Each one can be tackled independently and has specific deliverables.`,
            `After analyzing the requirements, I've identified ${createdSlices.length} key phases for this project. Each slice is designed to deliver incremental value.`,
            `I've structured this into ${createdSlices.length} manageable chunks. This approach allows for parallel work streams and clearer progress tracking.`,
            `Based on the scope, I recommend ${createdSlices.length} focused slices. This breakdown optimizes for both efficiency and quality delivery.`
        ];

        // Add context-specific messages
        let aiMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];

        // Add extra context for complex projects (many slices)
        if (createdSlices.length > 5) {
            aiMessage += " Given the complexity, I've prioritized dependencies to ensure smooth execution.";
        } else if (createdSlices.length <= 2) {
            aiMessage += " This is a relatively straightforward project with clear deliverables.";
        }

        // Add helpful tips based on request type
        const descLower = serviceRequest.description?.toLowerCase() || '';
        const titleLower = serviceRequest.title?.toLowerCase() || '';
        if (/web|app|frontend|backend/.test(descLower + titleLower)) {
            aiMessage += " 💡 Tip: Consider starting with the backend API to unblock frontend development.";
        } else if (/renovate|construct|build/.test(descLower + titleLower)) {
            aiMessage += " 💡 Tip: Ensure all materials are sourced before starting to avoid delays.";
        } else if (/design|mockup|prototype/.test(descLower + titleLower)) {
            aiMessage += " 💡 Tip: Get stakeholder feedback early on wireframes before investing in high-fidelity designs.";
        }

        const [aiComment] = await db.insert(comments).values({
            requestId: id,
            userId: userId, // Ideally this should be a system "AI Agent" user ID
            content: aiMessage,
            type: 'ai_response',
            isAiGenerated: true,
        }).returning();

        return NextResponse.json({
            slices: createdSlices,
            comment: aiComment
        });

    } catch (error) {
        console.error('Error in slicing:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
