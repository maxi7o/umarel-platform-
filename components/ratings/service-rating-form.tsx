"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServiceRatingFormProps {
    sliceId: string;
    requestId: string;
    providerId: string;
    providerName: string;
    locale?: string;
}

export function ServiceRatingForm({
    sliceId,
    requestId,
    providerId,
    providerName,
    locale = 'es'
}: ServiceRatingFormProps) {
    const router = useRouter();
    const [ratings, setRatings] = useState({
        quality: 0,
        communication: 0,
        timeliness: 0,
        professionalism: 0,
        value: 0,
    });
    const [feedback, setFeedback] = useState('');
    const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = locale === 'es' ? {
        title: 'Califica el servicio',
        description: `¿Cómo fue tu experiencia con ${providerName}?`,
        quality: 'Calidad del trabajo',
        communication: 'Comunicación',
        timeliness: 'Puntualidad',
        professionalism: 'Profesionalismo',
        value: 'Relación calidad-precio',
        feedback: 'Comentarios adicionales (opcional)',
        feedbackPlaceholder: 'Cuéntanos más sobre tu experiencia...',
        recommend: '¿Recomendarías este profesional?',
        yes: 'Sí, lo recomendaría',
        no: 'No lo recomendaría',
        submit: 'Enviar calificación',
        submitting: 'Enviando...',
        thankYou: '¡Gracias por tu calificación!',
        impactNote: 'Tu calificación ayudará a mejorar las recomendaciones y afectará el Aura del profesional.',
    } : {
        title: 'Rate the service',
        description: `How was your experience with ${providerName}?`,
        quality: 'Quality of work',
        communication: 'Communication',
        timeliness: 'Timeliness',
        professionalism: 'Professionalism',
        value: 'Value for money',
        feedback: 'Additional comments (optional)',
        feedbackPlaceholder: 'Tell us more about your experience...',
        recommend: 'Would you recommend this professional?',
        yes: 'Yes, I would recommend',
        no: 'No, I would not recommend',
        submit: 'Submit rating',
        submitting: 'Submitting...',
        thankYou: 'Thank you for your rating!',
        impactNote: 'Your rating will help improve recommendations and affect the professional\'s Aura.',
    };

    const ratingCategories = [
        { key: 'quality', label: t.quality },
        { key: 'communication', label: t.communication },
        { key: 'timeliness', label: t.timeliness },
        { key: 'professionalism', label: t.professionalism },
        { key: 'value', label: t.value },
    ];

    const handleStarClick = (category: string, value: number) => {
        setRatings(prev => ({ ...prev, [category]: value }));
    };

    const handleSubmit = async () => {
        // Validate all ratings are provided
        const allRated = Object.values(ratings).every(r => r > 0);
        if (!allRated || wouldRecommend === null) {
            alert(locale === 'es' ? 'Por favor completa todas las calificaciones' : 'Please complete all ratings');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/ratings/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sliceId,
                    requestId,
                    providerId,
                    ratings,
                    feedback,
                    wouldRecommend,
                }),
            });

            if (response.ok) {
                alert(t.thankYou);
                router.push(`/${locale}/requests/${requestId}`);
            } else {
                throw new Error('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert(locale === 'es' ? 'Error al enviar la calificación' : 'Error submitting rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    const StarRating = ({ category, value }: { category: string; value: number }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => handleStarClick(category, star)}
                    className="transition-transform hover:scale-110"
                >
                    <Star
                        className={`h-8 w-8 ${star <= value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Rating Categories */}
                {ratingCategories.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="font-medium">{label}</label>
                            <span className="text-sm text-muted-foreground">
                                {ratings[key as keyof typeof ratings]}/5
                            </span>
                        </div>
                        <StarRating
                            category={key}
                            value={ratings[key as keyof typeof ratings]}
                        />
                    </div>
                ))}

                {/* Recommendation */}
                <div className="space-y-2">
                    <label className="font-medium">{t.recommend}</label>
                    <div className="flex gap-3">
                        <Button
                            variant={wouldRecommend === true ? 'default' : 'outline'}
                            onClick={() => setWouldRecommend(true)}
                            className="flex-1"
                        >
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            {t.yes}
                        </Button>
                        <Button
                            variant={wouldRecommend === false ? 'destructive' : 'outline'}
                            onClick={() => setWouldRecommend(false)}
                            className="flex-1"
                        >
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            {t.no}
                        </Button>
                    </div>
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                    <label className="font-medium">{t.feedback}</label>
                    <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={t.feedbackPlaceholder}
                        rows={4}
                    />
                </div>

                {/* Impact Note */}
                <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    💡 {t.impactNote}
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                >
                    {isSubmitting ? t.submitting : t.submit}
                </Button>
            </CardContent>
        </Card>
    );
}
