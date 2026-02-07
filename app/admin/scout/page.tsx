import { Suspense } from 'react';
import ScoutClient from './client';

export default function ScoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ScoutClient />
        </Suspense>
    );
}
