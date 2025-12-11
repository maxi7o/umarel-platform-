'use client'

import { voteSlice } from './vote-actions'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

export function VoteButtons({ sliceId }: { sliceId: string }) {
    async function handleVote(direction: 'up' | 'down') {
        try {
            await voteSlice(sliceId, direction)
            if (direction === 'up') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
                toast.success('Ottimo lavoro! Aura points updated.')
            } else {
                toast.success('Voted down.')
            }
        } catch {
            toast.error('Failed to vote. Please log in.')
        }
    }

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 hover:text-orange-600 hover:bg-orange-50"
                onClick={() => handleVote('up')}
            >
                <ThumbsUp className="h-4 w-4" /> Upvote
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleVote('down')}
            >
                <ThumbsDown className="h-4 w-4" /> Downvote
            </Button>
        </div>
    )
}
