'use client';

import { Shield, Heart, Sparkles, Users, Clock, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

export function TrattoriaBenefits() {
    const benefits = [
        {
            icon: Shield,
            emoji: '🔒',
            title: 'Escrow Protection',
            description: 'Your money is safe until the work is done. Like nonna holding the recipe - it\'s released only when perfect.',
            color: 'from-[#D62828] to-[#B91C1C]',
            bgColor: 'bg-red-50',
        },
        {
            icon: Heart,
            emoji: '💝',
            title: 'Daily Dividends',
            description: 'Help the community, earn rewards. Every helpful comment adds to your plate.',
            color: 'from-[#52B788] to-[#40916C]',
            bgColor: 'bg-green-50',
        },
        {
            icon: Sparkles,
            emoji: '✨',
            title: 'AI Wizard',
            description: 'Our AI breaks down complex projects into bite-sized tasks. Like slicing a perfect lasagna.',
            color: 'from-[#E76F51] to-[#D65A3F]',
            bgColor: 'bg-orange-50',
        },
        {
            icon: Users,
            emoji: '👥',
            title: 'Community Wisdom',
            description: 'Experienced Umarels review every project. Multiple eyes catch what one might miss.',
            color: 'from-[#F4A261] to-[#E89350]',
            bgColor: 'bg-amber-50',
        },
        {
            icon: Award,
            emoji: '🏆',
            title: 'Aura Reputation',
            description: 'Build your reputation with every job. Quality work earns respect that lasts.',
            color: 'from-[#8B4513] to-[#6B3410]',
            bgColor: 'bg-amber-50',
        },
        {
            icon: CheckCircle2,
            emoji: '✅',
            title: 'Proof of Arrival',
            description: 'Photo evidence for every milestone. Truth is documented, disputes are rare.',
            color: 'from-[#52B788] to-[#2D6A4F]',
            bgColor: 'bg-emerald-50',
        },
        {
            icon: TrendingUp,
            emoji: '📈',
            title: 'Fair Pricing',
            description: 'Community-verified rates. No surprises, no hidden fees. Just honest work for honest pay.',
            color: 'from-[#D62828] to-[#9D0208]',
            bgColor: 'bg-red-50',
        },
        {
            icon: Clock,
            emoji: '⏰',
            title: 'Milestone Payments',
            description: 'Pay as you go. Each completed slice releases its payment. Progress you can see and trust.',
            color: 'from-[#E76F51] to-[#C85A3E]',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-[#FFF8F0] relative overflow-hidden">

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#52B788] rounded-full blur-3xl opacity-5" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#D62828] rounded-full blur-3xl opacity-5" />

            <div className="container relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="text-6xl">🍽️</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-4">
                        What's on the Table?
                    </h2>
                    <p className="text-xl text-[#6C5B4D] max-w-2xl mx-auto">
                        Every feature is crafted with care, like a family recipe passed down through generations.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`${benefit.bgColor} p-6 rounded-2xl border-2 border-[#E8D5C4] hover:border-[#D62828] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group relative overflow-hidden`}
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/50 rounded-bl-full" />

                            {/* Icon */}
                            <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <span className="text-3xl">{benefit.emoji}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-[#3D2817] mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-[#6C5B4D] leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom decorative quote */}
                <div className="text-center mt-16">
                    <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-[#E76F51] shadow-lg">
                        <p className="text-[#3D2817] italic text-lg">
                            "Non si fa così... we do it <span className="font-bold text-[#D62828]">together</span>, with <span className="font-bold text-[#52B788]">wisdom</span>."
                        </p>
                        <p className="text-[#6C5B4D] text-sm mt-2">— Every Umarel, everywhere</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
