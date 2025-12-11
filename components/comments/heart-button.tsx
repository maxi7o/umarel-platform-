"use client"

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
    commentId: string;
    initialHearts: number;
    initialHearted?: boolean;
    onHeartChange?: (hearts: number) => void;
}

export function HeartButton({
    commentId,
    initialHearts,
    initialHearted = false,
    onHeartChange,
}: HeartButtonProps) {
    const [hearts, setHearts] = useState(initialHearts);
    const [isHearted, setIsHearted] = useState(initialHearted);
    const [isLoading, setIsLoading] = useState(false);

    const handleHeart = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/comments/${commentId}/heart`, {
                method: isHearted ? 'DELETE' : 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to update heart');
            }

            const newHearts = isHearted ? hearts - 1 : hearts + 1;
            setHearts(newHearts);
            setIsHearted(!isHearted);
            onHeartChange?.(newHearts);
        } catch (error) {
            console.error('Error updating heart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleHeart}
            disabled={isLoading}
            className={cn(
                'gap-1.5',
                isHearted && 'text-red-500 hover:text-red-600'
            )}
        >
            <Heart
                className={cn(
                    'h-4 w-4',
                    isHearted && 'fill-current'
                )}
            />
            <span className="text-sm">{hearts}</span>
        </Button>
    );
}
