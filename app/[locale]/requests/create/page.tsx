'use client'

import { useTranslations } from 'next-intl'
import { RequestWizard } from '@/components/onboarding/request-wizard'

export default function CreateRequestPage() {
    const t = useTranslations()

    return (
        <div className="container py-10 max-w-2xl">
            <div className="mb-10 text-center">
                {/* Optional Header if Wizard doesn't cover it sufficiently */}
            </div>
            <RequestWizard />
        </div>
    )
}
