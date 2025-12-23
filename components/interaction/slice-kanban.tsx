import { DisputeActions } from '@/components/payments/dispute-actions';

// ... (imports)

// ... (interfaces)
interface Slice {
    id: string;
    title: string;
    description: string;
    estimatedEffort: string;
    status: 'proposed' | 'accepted' | 'completed';
    isAiGenerated: boolean;
    requiredSkills?: string[];
    escrow?: any; // Added escrow prop
}

// ... (component implementation)

{/* Simple controls to move items for demo */ }
<div className="flex justify-end gap-1 pt-2 border-t mt-2 flex-wrap">
    {/* Dispute Actions for active escrows */}
    {slice.escrow && (
        <div className="w-full flex justify-end mb-2">
            <DisputeActions
                escrowId={slice.escrow.id}
                currentStatus={slice.escrow.status}
                isAdmin={false} // Assume user for now
            />
        </div>
    )}

    {col.id === 'proposed' && isOwner && (
        <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs"
            onClick={() => handleMove(slice.id, 'accepted')}
        >
            Accept
        </Button>
    )}
    {col.id === 'accepted' && (
        <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs"
            onClick={() => handleMove(slice.id, 'completed')}
        >
            Complete
        </Button>
    )}
</div>
                                    </CardContent >
                                </Card >
                            ))}
                    </div >
                </div >
            ))}
        </div >
    );
}
