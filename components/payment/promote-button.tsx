"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PromoteButtonProps {
    offeringId: string;
}

export function PromoteButton({ offeringId }: PromoteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePromote = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offeringId }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    toast.error('Failed to start checkout');
                }
            } else {
                toast.error('Failed to create checkout session');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePromote}
            disabled={isLoading}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Rocket className="mr-2 h-4 w-4" />
            )}
            Promote Listing
        </Button>
    );
}
