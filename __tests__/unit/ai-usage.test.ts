
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shouldAnalyzeComment, processWizardMessage, processExpertComment, WizardAction } from '@/lib/ai/openai';

// Mock OpenAI
const { mockCreate } = vi.hoisted(() => {
    return { mockCreate: vi.fn() };
});

vi.mock('openai', () => {
    return {
        default: class OpenAI {
            chat = {
                completions: {
                    create: mockCreate
                }
            }
        }
    };
});

describe('AI Logic (Mocked)', () => {
    beforeEach(() => {
        mockCreate.mockClear();
    });

    // Test Case 4: Token Optimization Logic
    it('shouldAnalyzeComment filters low-value comments', () => {
        expect(shouldAnalyzeComment('Ok')).toBe(false);
        expect(shouldAnalyzeComment('Thanks!')).toBe(false);
        expect(shouldAnalyzeComment('Great job')).toBe(false);
        expect(shouldAnalyzeComment('This is a detailed technical instruction about the rug fiber.')).toBe(true);
    });

    // Test Case 5: Wizard Message Processing (Mocked)
    it('processWizardMessage returns correct actions from AI response', async () => {
        // Mock the OpenAI response
        const mockResponseActions: WizardAction[] = [
            { type: 'UPDATE_CARD', cardId: '123', updates: { finalPrice: 5000 } }
        ];

        mockCreate.mockResolvedValueOnce({
            choices: [{
                message: {
                    content: JSON.stringify({
                        message: "I updated the price.",
                        actions: mockResponseActions
                    })
                }
            }]
        });

        const result = await processWizardMessage(
            "Update price to 5000",
            [{ id: '123', title: 'Test' }],
            []
        );

        expect(result.message).toBe("I updated the price.");
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0].type).toBe('UPDATE_CARD');
        // @ts-ignore
        expect(result.actions[0].updates.finalPrice).toBe(5000);

        // Verify OpenAI was called
        expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    // Test Case 6: Expert Comment Processing (Mocked)
    it('processExpertComment handles valid technical feedback', async () => {
        mockCreate.mockResolvedValueOnce({
            choices: [{
                message: {
                    content: JSON.stringify({
                        wizardQuestion: "How big is it?",
                        qualityScore: 8,
                        actions: []
                    })
                }
            }]
        });

        const result = await processExpertComment(
            "Make sure to ask about the size.",
            [{ id: '123' }],
            '123'
        );

        expect(result.wizardQuestion).toBe("How big is it?");
        expect(result.qualityScore).toBe(8);
    });

    // Test Case 10: Process Expert Comment Skip Logic via mocking
    it('processExpertComment skips AI call for short comments', async () => {
        const result = await processExpertComment("Ok", [], '123');

        // Should return early and NOT call OpenAI
        expect(mockCreate).not.toHaveBeenCalled();
        expect(result.actions).toHaveLength(0);
    });
});
