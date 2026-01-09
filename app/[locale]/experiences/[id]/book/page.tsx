import { db } from '@/lib/db';
import { experiences, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AIInterviewer } from '@/components/experiences/ai-interviewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default async function ExperienceBookingPage({ params }: PageProps) {
    const { id } = await params;
    const t = await getTranslations('booking');

    // Fetch Experience
    const [experience] = await db
        .select({
            id: experiences.id,
            title: experiences.title,
            description: experiences.description,
            date: experiences.date,
            location: experiences.location,
            durationMinutes: experiences.durationMinutes,
            pricingConfig: experiences.pricingConfig,
            provider: {
                fullName: users.fullName,
                avatarUrl: users.avatarUrl,
            }
        })
        .from(experiences)
        .leftJoin(users, eq(experiences.providerId, users.id))
        .where(eq(experiences.id, id))
        .limit(1);

    if (!experience) {
        notFound();
    }

    // Extract AI config
    // We safely cast because we know the schema, but in a real app better validation is needed
    const pricingConfig = experience.pricingConfig as any;
    const initialQuestions = pricingConfig?.aiInterviewerConfig?.initial_questions || [
        "What motivated you to join this experience?",
        "Do you have any specific requirements?"
    ];

    return (
        <div className="container max-w-4xl py-10 px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Experience Details */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-muted/30 border-none shadow-none">
                        <CardHeader>
                            <Badge variant="outline" className="w-fit mb-2">Experience</Badge>
                            <CardTitle className="text-xl">{experience.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                                <span className="font-semibold text-primary">{experience.provider?.fullName}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{format(new Date(experience.date), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{format(new Date(experience.date), 'p')} • {experience.durationMinutes} min</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{experience.location || 'Virtual'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-semibold mb-1">Why an AI Interview?</p>
                        <p className="opacity-90">
                            Instead of filling out a boring form, our AI Agent helps you customize your experience and ensures the host is prepared for you.
                        </p>
                    </div>
                </div>

                {/* Right Column: AI Interviewer */}
                <div className="md:col-span-2">
                    <AIInterviewer
                        experienceId={experience.id}
                        experienceTitle={experience.title}
                        initialQuestions={initialQuestions}
                        basePrice={pricingConfig?.basePrice || 0}
                    />
                </div>
            </div>
        </div>
    );
}
