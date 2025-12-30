
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { serviceOfferings, users, providerMetrics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Globe, Shield, Star, CheckCircle2, User } from 'lucide-react';
import { CurrencyDisplay } from '@/components/currency-display';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export default async function OfferingDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id, locale } = await params;
    const t = await getTranslations('offeringDetail');

    // Fetch Offering
    const [offering] = await db
        .select()
        .from(serviceOfferings)
        .where(eq(serviceOfferings.id, id));

    if (!offering) {
        notFound();
    }

    // Fetch Provider
    const [provider] = await db
        .select()
        .from(users)
        .where(eq(users.id, offering.providerId));

    // Fetch Metrics
    const [metrics] = await db
        .select()
        .from(providerMetrics)
        .where(eq(providerMetrics.providerId, offering.providerId));

    // Determine current user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user?.id === provider.id;

    // Helper to calc metrics
    const completionRate = (metrics?.totalSlicesCompleted ?? 0) > 0
        ? Math.round(((metrics?.totalSlicesCompleted ?? 0) / ((metrics?.totalSlicesCompleted ?? 0) + 1)) * 100)
        : 0;

    return (
        <div className="container mx-auto max-w-6xl px-6 py-10">
            {/* Breadcrumb / Back */}
            <div className="mb-6">
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                    ← {t('backToBrowse')}
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="secondary" className="text-sm border-gray-200">
                                {(offering.category as string) || 'Service'}
                            </Badge>
                            {offering.isVirtual && (
                                <Badge variant="outline" className="gap-1 border-gray-200">
                                    <Globe className="h-3 w-3" />
                                    {t('virtual')}
                                </Badge>
                            )}
                            <span className="text-sm text-muted-foreground flex items-center gap-1 ml-auto">
                                <Clock className="h-3 w-3" />
                                {formatDate(offering.createdAt || new Date(), 'UTC')}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900 mb-4">
                            {offering.title}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            {offering.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{offering.location as string}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Portfolio Images */}
                    {offering.portfolioImages && Array.isArray(offering.portfolioImages) && offering.portfolioImages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(offering.portfolioImages as string[]).map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`Portfolio ${idx}`} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    <div className="prose max-w-none">
                        <h3 className="text-xl font-semibold mb-3">{t('aboutService')}</h3>
                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {offering.description}
                        </p>
                    </div>

                    {/* Skills */}
                    {offering.skills && Array.isArray(offering.skills) && (offering.skills as string[]).length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-3">{t('skills')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {(offering.skills as string[]).map(skill => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Pricing & Provider */}
                <div className="space-y-6">
                    {/* Pricing Card */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24">
                        <div className="flex items-baseline gap-1 mb-6">
                            {offering.hourlyRate ? (
                                <>
                                    <span className="text-3xl font-bold text-gray-900">
                                        <CurrencyDisplay amount={offering.hourlyRate} />
                                    </span>
                                    <span className="text-gray-500">/hr</span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-gray-900">
                                    <CurrencyDisplay amount={offering.fixedRate || 0} />
                                </span>
                            )}
                        </div>

                        {offering.availability && (
                            <div className="mb-6 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                                <strong>{t('availability')}:</strong> {offering.availability}
                            </div>
                        )}

                        {isOwner ? (
                            <Link href={`/offerings/${offering.id}/edit`}>
                                <Button className="w-full h-12 text-lg" variant="outline">
                                    {t('editOffering')}
                                </Button>
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                <Link href={`/post-request?offeringId=${offering.id}`}>
                                    <Button className="w-full h-12 text-lg bg-gray-900 hover:bg-black text-white shadow-md transition-all">
                                        {t('contactProvider')}
                                    </Button>
                                </Link>
                                <p className="text-xs text-center text-muted-foreground px-4">
                                    {t('contactDisclaimer')}
                                </p>
                            </div>
                        )}

                        <hr className="my-6 border-gray-100" />

                        {/* Provider Mini Profile */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                {t('provider')}
                            </h4>
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                    <AvatarImage src={provider.avatarUrl || undefined} />
                                    <AvatarFallback className="bg-orange-100 text-orange-800">
                                        {(provider.fullName || 'User').charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/profile/${provider.id}`} className="font-semibold text-lg hover:underline decoration-gray-400 underline-offset-4">
                                        {provider.fullName || 'Unknown Provider'}
                                    </Link>
                                    <div className="flex items-center gap-1 text-sm text-purple-600 font-medium">
                                        <Shield className="h-3.5 w-3.5" />
                                        <span>{provider.auraPoints} Aura</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="font-bold text-gray-900">{completionRate}%</div>
                                    <div className="text-muted-foreground text-xs">{t('completion')}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="font-bold text-gray-900 flex items-center justify-center gap-1">
                                        {metrics?.rating || 'N/A'} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="text-muted-foreground text-xs">{t('rating')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
