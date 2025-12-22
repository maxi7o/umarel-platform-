import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requests, slices, comments, quotes, users, questions, answers, changeProposals } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { RequestInteractionLayout } from '@/components/interaction/request-interaction-layout'
import { getOpenSlicesForProvider } from '@/lib/services/slice-service';

// Mock data for development when DB is not connected
const MOCK_REQUEST = {
    id: 'demo',
    title: 'Renovate my small bathroom',
    description: 'I need to replace the tiles, install a new sink, and paint the walls. The bathroom is about 4 square meters.',
    location: 'Via Roma 123, Milano',
    createdAt: new Date(),
    user: { fullName: 'Giuseppe Verdi' }
}

const MOCK_SLICES = [
    {
        id: '1',
        title: 'Demolition & Removal',
        description: 'Remove old tiles and sanitary ware. Dispose of debris.',
        estimatedEffort: '1 day',
        status: 'accepted',
        createdAt: new Date(),
        creator: { fullName: 'Mario Rossi' },
        upvotes: 5
    },
    {
        id: '2',
        title: 'Plumbing Rough-in',
        description: 'Adjust pipes for new sink position.',
        estimatedEffort: '4 hours',
        status: 'proposed',
        createdAt: new Date(),
        creator: { fullName: 'Luigi Bianchi' },
        upvotes: 3
    }
]

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    let request;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requestSlices: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requestComments: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requestQuotes: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requestQuestions: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requestProposals: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentUser: any = null;

    try {
        // Try to fetch from DB
        const result = await db.select().from(requests).where(eq(requests.id, id));
        request = result[0];

        if (request) {
            import { getOpenSlicesForProvider } from '@/lib/services/slice-service';

            // ... inside component ...
            // Fetch Slices
            requestSlices = await getOpenSlicesForProvider(id);

            // Fetch Comments
            requestComments = await db
                .select()
                .from(comments)
                .where(eq(comments.requestId, id))
                .orderBy(desc(comments.createdAt));

            // Fetch Quotes
            // Ideally join with provider (user)
            const quotesResult = await db.select().from(quotes).where(eq(quotes.requestId, id));

            // Manually fetch providers for quotes (for demo simplicity)
            // In production, use a join
            requestQuotes = await Promise.all(quotesResult.map(async (q) => {
                const [provider] = await db.select().from(users).where(eq(users.id, q.providerId));
                return { ...q, provider };
            }));

            // Fetch user for request if needed
            const [user] = await db.select().from(users).where(eq(users.id, request.userId));
            if (user) {
                request = { ...request, user };
            }

            // Fetch Questions with answers
            const requestQuestionsData = await db
                .select()
                .from(questions)
                .where(eq(questions.requestId, id))
                .orderBy(desc(questions.createdAt));

            // For each question, fetch asker and answers
            requestQuestions = await Promise.all(
                requestQuestionsData.map(async (question) => {
                    const [asker] = await db.select().from(users).where(eq(users.id, question.askerId));
                    const questionAnswers = await db
                        .select()
                        .from(answers)
                        .where(eq(answers.questionId, question.id));

                    const answersWithUsers = await Promise.all(
                        questionAnswers.map(async (answer) => {
                            const [answerer] = await db.select().from(users).where(eq(users.id, answer.answererId));
                            return { ...answer, answerer };
                        })
                    );

                    return { ...question, asker, answers: answersWithUsers };
                })
            );

            // Fetch Change Proposals
            requestProposals = await db
                .select()
                .from(changeProposals)
                .where(eq(changeProposals.requestId, id))
                .orderBy(desc(changeProposals.createdAt));

            // Fetch a "current user" for interaction (simulating logged in user)
            // In a real app, this would come from auth session
            // Fetch "Maria" (Owner) for interaction
            const [dbUser] = await db.select().from(users).where(eq(users.email, 'maria@demo.com'));
            currentUser = dbUser;
        }

    } catch (e) {
        console.error("DB Error, using mock data if id is demo", e);
    }

    // Fallback to mock data for demo purposes
    if (!request && id === 'demo') {
        request = MOCK_REQUEST;
        requestSlices = MOCK_SLICES;
        requestComments = [];
        requestQuotes = [];
        requestQuestions = [
            {
                id: 'q1',
                content: 'What type of tiles do you recommend for a small bathroom? I want something durable but budget-friendly.',
                status: 'forwarded_to_community',
                forwardedToCommunity: true,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                asker: { fullName: 'Demo Provider', auraPoints: 50 },
                answers: [
                    {
                        id: 'a1',
                        content: 'For a small bathroom, I recommend porcelain tiles. They are water-resistant, durable, and come in many affordable options. Look for 30x30cm tiles to make the space feel larger.',
                        upvotes: 5,
                        auraReward: 15,
                        moneyReward: 75,
                        isAccepted: true,
                        createdAt: new Date(Date.now() - 43200000).toISOString(),
                        answerer: { fullName: 'Expert Umarel', auraPoints: 250 }
                    }
                ]
            },
            {
                id: 'q2',
                content: 'How long should this renovation take? I need to plan my schedule.',
                status: 'pending',
                forwardedToCommunity: false,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                asker: { fullName: 'Another Provider', auraPoints: 30 },
                answers: []
            }
        ];
        currentUser = { id: 'demo-user', fullName: 'Demo Provider', email: 'demo@provider.com', avatarUrl: null };
    }

    if (!request) {
        notFound()
    }

    return (
        <div className="container mx-auto max-w-7xl w-full px-6 md:px-8 lg:px-12 py-10">
            <h1 className="text-3xl font-bold font-outfit mb-2">{request.title}</h1>
            <RequestInteractionLayout
                request={request}
                initialSlices={requestSlices}
                initialComments={requestComments}
                initialQuotes={requestQuotes}
                initialQuestions={requestQuestions}

                initialProposals={requestProposals}
                currentUser={currentUser}
            />
        </div>
    )
}
