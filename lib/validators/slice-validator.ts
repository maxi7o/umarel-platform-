/**
 * Slice Validation Utilities
 * Ensures slices meet marketplace requirements (≤0.5 day, proper structure)
 */

export interface SliceValidationError {
    field: string;
    message: string;
}

export interface SliceInput {
    title: string;
    description: string;
    estimatedHours?: number;
    estimatedEffort?: string;
    dependencies?: string[];
    skillsRequired?: string[];
}

/**
 * Validates that a slice meets the ≤0.5 day (4 hours) requirement
 */
export function validateSliceEffort(slice: SliceInput): SliceValidationError[] {
    const errors: SliceValidationError[] = [];

    // Check estimated hours
    if (slice.estimatedHours !== undefined) {
        if (slice.estimatedHours <= 0) {
            errors.push({
                field: 'estimatedHours',
                message: 'Estimated hours must be greater than 0'
            });
        }

        if (slice.estimatedHours > 4) {
            errors.push({
                field: 'estimatedHours',
                message: 'Slice must be ≤ 4 hours (0.5 day). Consider breaking into smaller units.'
            });
        }
    }

    // Parse estimatedEffort if provided (e.g., "2 hours", "1 day")
    if (slice.estimatedEffort) {
        const effort = parseEffortToHours(slice.estimatedEffort);
        if (effort > 4) {
            errors.push({
                field: 'estimatedEffort',
                message: `Estimated effort "${slice.estimatedEffort}" exceeds 4 hours. Break into smaller slices.`
            });
        }
    }

    return errors;
}

/**
 * Validates slice title and description quality
 */
export function validateSliceContent(slice: SliceInput): SliceValidationError[] {
    const errors: SliceValidationError[] = [];

    if (!slice.title || slice.title.trim().length < 10) {
        errors.push({
            field: 'title',
            message: 'Slice title must be descriptive (at least 10 characters)'
        });
    }

    if (slice.title && slice.title.length > 100) {
        errors.push({
            field: 'title',
            message: 'Slice title too long (max 100 characters)'
        });
    }

    if (!slice.description || slice.description.trim().length < 20) {
        errors.push({
            field: 'description',
            message: 'Slice description must be detailed (at least 20 characters)'
        });
    }

    return errors;
}

/**
 * Full slice validation
 */
export function validateSlice(slice: SliceInput): SliceValidationError[] {
    return [
        ...validateSliceEffort(slice),
        ...validateSliceContent(slice)
    ];
}

/**
 * Parse effort string to hours
 * Examples: "2 hours" -> 2, "1 day" -> 8, "0.5 day" -> 4
 */
export function parseEffortToHours(effort: string): number {
    const normalized = effort.toLowerCase().trim();

    // Match patterns like "2 hours", "1.5 hours"
    const hoursMatch = normalized.match(/(\d+\.?\d*)\s*h(ou)?r?s?/);
    if (hoursMatch) {
        return parseFloat(hoursMatch[1]);
    }

    // Match patterns like "1 day", "0.5 day"
    const daysMatch = normalized.match(/(\d+\.?\d*)\s*days?/);
    if (daysMatch) {
        return parseFloat(daysMatch[1]) * 8; // Assume 8-hour workday
    }

    // Default to 2 hours if can't parse
    return 2;
}

/**
 * Format hours to human-readable effort
 */
export function formatHoursToEffort(hours: number): string {
    if (hours <= 0) return '0 hours';
    if (hours === 1) return '1 hour';
    if (hours < 8) return `${hours} hours`;
    if (hours === 8) return '1 day';
    return `${(hours / 8).toFixed(1)} days`;
}

/**
 * Check if slice is within marketplace limits
 */
export function isSliceValid(slice: SliceInput): boolean {
    const errors = validateSlice(slice);
    return errors.length === 0;
}
