"use client"

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { detectBrowserLanguage } from '@/lib/language-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Globe } from 'lucide-react';

export function LanguageSwitchPrompt() {
    const pathname = usePathname();
    const router = useRouter();
    const [showPrompt, setShowPrompt] = useState(false);
    const [systemLang, setSystemLang] = useState<string | null>(null);
    const [currentLang, setCurrentLang] = useState<string>('en');
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Detect system language once on mount
        const detectedLang = detectBrowserLanguage();
        setSystemLang(detectedLang);

        // Get current language from URL
        const urlLang = pathname.split('/')[1] || 'en';
        setCurrentLang(urlLang);

        // Check if user manually switched language (stored in sessionStorage)
        const hasManuallySwitch = sessionStorage.getItem('manualLanguageSwitch');

        // Only show prompt if:
        // 1. User manually switched language (not on initial load)
        // 2. Current language differs from system language
        // 3. Not dismissed yet
        if (hasManuallySwitch && detectedLang !== urlLang && !dismissed) {
            setShowPrompt(true);
        }
    }, [pathname, dismissed]);

    const handleSwitchBack = () => {
        if (systemLang) {
            const currentPath = pathname.split('/').slice(2).join('/') || 'browse';
            router.push(`/${systemLang}/${currentPath}`);
            setShowPrompt(false);
            setDismissed(true);
            sessionStorage.removeItem('manualLanguageSwitch');
        }
    };

    const handleKeepCurrent = () => {
        setShowPrompt(false);
        setDismissed(true);
        // Keep the manual switch flag
    };

    if (!showPrompt || !systemLang || systemLang === currentLang) return null;

    const languageNames: Record<string, string> = {
        'en': 'English',
        'it': 'Italian',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'pt': 'Portuguese',
        'ja': 'Japanese',
        'nl': 'Dutch',
        'sv': 'Swedish',
    };

    const currentLangName = languageNames[currentLang] || currentLang;
    const systemLangName = languageNames[systemLang] || systemLang;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
            <Card className="shadow-lg border-primary bg-card">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-sm">Switch Language?</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                You are seeing this site in {currentLangName}. Want to switch back to {systemLangName}?
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSwitchBack} className="flex-1">
                                    Switch to {systemLangName}
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleKeepCurrent} className="flex-1">
                                    Keep {currentLangName}
                                </Button>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={handleKeepCurrent}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
