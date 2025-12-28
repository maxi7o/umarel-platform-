'use client';

import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({ title, text, url, className, variant = 'outline', size = 'default' }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;

        // Try Native Share API first (Mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: shareUrl,
                });
                return;
            } catch (error) {
                // User cancelled or failed
                console.log('Share skipped', error);
            }
        }

        // Fallback to Clipboard
        try {
            await navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleShare}
            aria-label="Share"
        >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            {size !== 'icon' && <span className="ml-2">Share</span>}
        </Button>
    );
}
