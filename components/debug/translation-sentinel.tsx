'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

// Heuristic list of English words to flag in Spanish/Italian mode
const SUSPICIOUS_ENGLISH = [
    'Scope', 'Request', 'Status', 'Defining', 'Budget', 'Loading', 'Error',
    'Submitted', 'Accepted', 'Completed', 'Proposed', 'Quotes', 'Slices',
    'Description', 'Location', 'Posted By', 'Current Phase',
    'Open for Bids', 'Value Engineering', 'Foreman'
];

export function TranslationSentinel() {
    const locale = useLocale();
    const [issues, setIssues] = useState<number>(0);

    useEffect(() => {
        // Only run in non-English locales (or if you want to test strictness)
        if (locale === 'en') return;
        if (process.env.NODE_ENV !== 'development') return;

        const observer = new MutationObserver((mutations) => {
            let foundIssues = 0;

            // Scan all text nodes in the body
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent?.trim();
                if (!text || text.length < 3) continue;

                // Check against heuristics
                // We use a simple inclusion check. 
                // In a real automated tool, we might use a language detection library.
                const hasEnglish = SUSPICIOUS_ENGLISH.some(word =>
                    text.includes(word) && !text.includes('Umarel') // Exclude brand name
                );

                if (hasEnglish) {
                    const parent = node.parentElement;
                    if (parent && !parent.hasAttribute('data-translation-flagged')) {
                        // Flas the element
                        parent.style.outline = '2px dashed red';
                        parent.style.position = 'relative';
                        parent.setAttribute('data-translation-flagged', 'true');
                        parent.title = `⚠️ Suspicious English detected: "${text}"`;
                        foundIssues++;
                    }
                }
            }

            if (foundIssues > 0) {
                setIssues(prev => prev + foundIssues);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        return () => observer.disconnect();
    }, [locale]);

    if (process.env.NODE_ENV !== 'development' || locale === 'en') return null;

    if (issues === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-[9999] text-xs font-bold animate-pulse flex items-center gap-2 pointer-events-none">
            <span>🛡️ Translation Sentinel:</span>
            <span>{issues} potential issues detected</span>
        </div>
    );
}
