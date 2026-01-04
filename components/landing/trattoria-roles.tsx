'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function TrattoriaRoles() {
    const t = useTranslations('landing');
    const tTrattoria = useTranslations('landing.trattoria');

    const roles = [
        {
            emoji: '🔍',
            title: t('roles.client.title'),
            description: t('roles.client.description'),
            color: 'from-[#D62828] to-[#B91C1C]',
            bgColor: 'bg-red-50',
            illustration: '🏠',
            cta: tTrattoria('rolesCta.seeker'),
            link: '/requests/create',
        },
        {
            emoji: '🛠️',
            title: t('roles.builder.title'),
            description: t('roles.builder.description'),
            color: 'from-[#52B788] to-[#40916C]',
            bgColor: 'bg-green-50',
            illustration: '⚒️',
            cta: tTrattoria('rolesCta.creator'),
            link: '/create-offering',
        },
        {
            emoji: '👴',
            title: t('roles.umarel.title'),
            description: t('roles.umarel.description'),
            color: 'from-[#E76F51] to-[#D65A3F]',
            bgColor: 'bg-orange-50',
            illustration: '🦉',
            cta: tTrattoria('rolesCta.umarel'),
            link: '/browse',
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-[#FFF8F0] relative overflow-hidden">

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#F4A261] rounded-full blur-3xl opacity-5" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#52B788] rounded-full blur-3xl opacity-5" />

            <div className="container relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="text-6xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-4">
                        {tTrattoria('rolesTitle')}
                    </h2>
                    <p className="text-xl text-[#6C5B4D] max-w-2xl mx-auto">
                        {tTrattoria('rolesSubtitle')}
                    </p>
                </div>

                {/* Roles Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                    {roles.map((role, index) => (
                        <div
                            key={index}
                            className={`${role.bgColor} rounded-3xl p-8 border-2 border-[#E8D5C4] hover:border-[#D62828] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group`}
                        >
                            {/* Background illustration */}
                            <div className="absolute bottom-0 right-0 text-9xl opacity-5 group-hover:opacity-10 transition-opacity">
                                {role.illustration}
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-20 h-20 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                                    <span className="text-4xl">{role.emoji}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-[#3D2817] mb-4">
                                    {role.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[#6C5B4D] leading-relaxed mb-6 text-base">
                                    {role.description}
                                </p>

                                {/* CTA */}
                                <Link href={role.link as any}>
                                    <Button
                                        className={`w-full bg-gradient-to-r ${role.color} text-white hover:shadow-lg transition-all duration-300 group/btn`}
                                        size="lg"
                                    >
                                        {role.cta}
                                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Community Quote */}
                <div className="text-center">
                    <div className="inline-block bg-white/90 backdrop-blur-sm px-10 py-6 rounded-2xl border-2 border-[#E76F51] shadow-xl max-w-3xl">
                        <p className="text-[#3D2817] text-xl italic mb-3">
                            "{tTrattoria('rolesQuote')}"
                        </p>
                        <div className="flex items-center justify-center gap-3 text-[#6C5B4D]">
                            <span className="text-2xl">🍝</span>
                            <span className="font-semibold">{tTrattoria('rolesQuoteTag')}</span>
                            <span className="text-2xl">🍝</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
