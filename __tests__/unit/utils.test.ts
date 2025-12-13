
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
    // Test Case 7: Class Name Utility
    it('merges class names correctly', () => {
        expect(cn('c1', 'c2')).toBe('c1 c2');
        expect(cn('c1', { 'c2': true, 'c3': false })).toBe('c1 c2');
        // Tailwind merge test (if simple conflict)
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });
});
