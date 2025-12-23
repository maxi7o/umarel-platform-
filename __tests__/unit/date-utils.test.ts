
import { describe, it, expect } from 'vitest';
import { formatDate, toUTC, getUserTimezone } from '@/lib/utils/date';

describe('Date Utilities', () => {
    describe('formatDate', () => {
        it('should format a date string to the specified locale and timezone', () => {
            const date = new Date('2023-10-05T14:30:00Z'); // 14:30 UTC
            const timezone = 'America/Argentina/Buenos_Aires'; // UTC-3
            const locale = 'es-AR';

            // 14:30 UTC - 3 hours = 11:30
            const formatted = formatDate(date, timezone, locale);
            expect(formatted).toContain('11:30');
            expect(formatted).toContain('5/10/2023'); // or 05/10/2023 depending on locale specifics
        });

        it('should handle different timezones', () => {
            const date = new Date('2023-10-05T14:30:00Z');
            const timezone = 'America/New_York'; // UTC-4 (EDT in Oct)

            // 14:30 UTC - 4 hours = 10:30
            const formatted = formatDate(date, timezone, 'en-US');
            expect(formatted).toContain('10:30');
        });
    });

    describe('toUTC', () => {
        it('should convert a local date string to a UTC Date object', () => {
            const localDateString = '2023-10-05T11:30';
            const timezone = 'America/Argentina/Buenos_Aires'; // UTC-3

            // 11:30 local + 3 hours = 14:30 UTC
            const utcDate = toUTC(localDateString, timezone);

            expect(utcDate.toISOString()).toBe('2023-10-05T14:30:00.000Z');
        });
    });

    describe('getUserTimezone', () => {
        it('should return the user timezone or default to UTC via Intl', () => {
            // This is harder to test strictly without mocking Intl, but we verify it returns a string
            const tz = getUserTimezone();
            expect(typeof tz).toBe('string');
            expect(tz.length).toBeGreaterThan(0);
        });
    });
});
