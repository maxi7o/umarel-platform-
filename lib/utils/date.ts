
/**
 * Gets the user's current timezone.
 * Defaults to 'UTC' if not detectable.
 */
export function getUserTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        return 'UTC';
    }
}

/**
 * Formats a date object to a string in the specified timezone and locale.
 */
export function formatDate(date: Date, timezone: string, locale: string = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(date);
}

/**
 * Converts a local date string (e.g., "YYYY-MM-DDTHH:mm") from a specific timezone to a UTC Date object.
 * This conversion converts the "wall time" in the given timezone to the equivalent UTC instant.
 */
export function toUTC(localDateString: string, timezone: string): Date {
    // 1. Create a date object treating the string as UTC first to preserve the "wall time" components
    // We append 'Z' to treat it as UTC
    const wallTimeAsUtc = new Date(localDateString + 'Z');

    // 2. We need to find the offset of the target timezone at this specific wall time.
    // However, native JS makes getting arbitrary timezone offsets for a specific wall time tricky.
    //
    // Strategy:
    // We iterate to find the timestamp where .toLocaleString(timezone) matches our target wall time.
    // Better Strategy (Inverse):
    // "What UTC time, when printed in 'timezone', equals 'localDateString'?"

    // Attempt 1: Use the simple offset of the *current* time? No, DST matters.
    // Attempt 2: Use the difference between UTC-formatted and TZ-formatted strings?

    // Let's use the 'date-fns' equivalent logic using native Intl:
    // "11:30" in Buenos Aires.
    // Guess: Treat 11:30 as UTC. (14:30 in system? No, 11:30 UTC).
    // Format 11:30 UTC in Buenos Aires -> "08:30" (if BA is -3).
    // Difference is 3 hours.
    // So we add 3 hours to 11:30 UTC -> 14:30 UTC.

    // Let's implement this "diff" approach.

    if (isNaN(wallTimeAsUtc.getTime())) {
        throw new Error('Invalid date string format');
    }

    // Get the execution environment's display of the "Wall Time as UTC" in the TARGET timezone
    // e.g. We have 11:30 UTC. In BA (UTC-3), that is 08:30.
    const targetString = wallTimeAsUtc.toLocaleString('en-US', { timeZone: timezone });
    const targetDate = new Date(targetString);

    // Calculate the offset between the UTC date and the interpreted target date
    // 11:30 (as UTC timestamp) - 08:30 (as system timestamp interpretation of the string)
    // Wait, new Date(targetString) uses SYSTEM timezone. This adds another layer of offset.

    // A more reliable, albeit heavier way without a library:
    // 1. Guess UTC = Wall Time (e.g. 11:30Z)
    // 2. Format Guess in Target TZ (e.g. 08:30)
    // 3. Compare Wall Time vs Formatted Guess.
    // 4. Adjust Guess by the difference.
    // 5. Repeat? Usually once is enough.

    let guess = new Date(wallTimeAsUtc.getTime()); // 11:30 UTC

    // Formatting parts to ISO-like string to compare components
    const getParts = (d: Date, tz: string) => {
        const f = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
            timeZone: tz
        });
        const parts = f.formatToParts(d);
        const p: any = {};
        parts.forEach(({ type, value }) => p[type] = value);
        // return milliseconds number for comparison?
        // Construct a UTC date from these parts to strictly compare wall time values
        return new Date(`${p.year}-${p.month}-${p.day}T${p.hour === '24' ? '00' : p.hour}:${p.minute}:${p.second}Z`).getTime();
    };

    const targetWallTime = wallTimeAsUtc.getTime(); // 11:30 extracted value

    // Initial loop
    let diff = 0;
    for (let i = 0; i < 3; i++) {
        const guessInTz = getParts(guess, timezone); // What time is 'guess' in the target TZ?
        diff = targetWallTime - guessInTz; // Expected - Actual

        if (Math.abs(diff) < 1000) break; // Close enough

        guess = new Date(guess.getTime() + diff);
    }

    return guess;
}
