import { Suspense } from 'react';
import ScoutQueueClient from './client';

export default function ScoutQueuePage() {
    return (
        <Suspense fallback={<div>Loading queue...</div>}>
            <ScoutQueueClient />
        </Suspense>
    );
}
