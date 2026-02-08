/** @vitest-environment happy-dom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuoteEvaluationView } from '@/components/interaction/quote-evaluation-view';
import * as pdfLibrary from 'jspdf';
import React from 'react';

// Mock jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();
const mockLine = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetFillColor = vi.fn();
const mockRect = vi.fn();
const mockSplitTextToSize = vi.fn((text) => [text]);

vi.mock('jspdf', () => {
    const jsPDF = vi.fn().mockImplementation(() => ({
        save: mockSave,
        text: mockText,
        setFont: mockSetFont,
        setFontSize: mockSetFontSize,
        setTextColor: mockSetTextColor,
        line: mockLine,
        setDrawColor: mockSetDrawColor,
        setFillColor: mockSetFillColor,
        rect: mockRect,
        splitTextToSize: mockSplitTextToSize,
        internal: {
            pageSize: { height: 297 }
        }
    }));
    return {
        default: jsPDF,
        jsPDF: jsPDF
    };
});

// Mock translations
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key
}));

describe('QuoteEvaluationView Integration', () => {
    const mockQuote = {
        id: 'q1',
        amount: 1500000, // 15,000.00
        currency: 'ARS',
        message: 'Detailed proposal for roof repair.',
        provider: {
            id: 'p1',
            fullName: 'Carlos Reparaciones',
            avatarUrl: '',
            auraPoints: 50
        },
        createdAt: new Date().toISOString()
    };

    const mockFeedback = [
        {
            id: 'f1',
            authorName: 'Expert AI',
            content: 'Looks good',
            sentiment: 'positive' as const,
            isVerified: true,
            createdAt: new Date().toISOString()
        }
    ];

    const mockAccept = vi.fn();
    const mockReject = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render quote details correctly', () => {
        render(
            <QuoteEvaluationView
                quote={mockQuote}
                feedbacks={mockFeedback}
                onAccept={mockAccept}
                onReject={mockReject}
                requestTitle="Roof Fix Project"
            />
        );

        expect(screen.getByText('Carlos Reparaciones')).toBeInTheDocument();
        // Since we mocked formatCurrency or rely on its output, let's just check if it renders roughly
        // or check unique text.
        expect(screen.getByText(/Detailed proposal/)).toBeInTheDocument();
        expect(screen.getByText('Expert AI')).toBeInTheDocument();
    });

    it.skip('should trigger PDF export when button is clicked', () => {
        render(
            <QuoteEvaluationView
                quote={mockQuote}
                feedbacks={mockFeedback}
                onAccept={mockAccept}
                onReject={mockReject}
                requestTitle="Roof Fix Project"
                requestLocation="Buenos Aires"
            />
        );

        const exportBtn = screen.getByText('Exportar PDF');
        fireEvent.click(exportBtn);

        // Check if jsPDF was instantiated
        expect(pdfLibrary.default).toHaveBeenCalled();

        // Check if content was written
        expect(mockText).toHaveBeenCalledWith(expect.stringContaining('Presupuesto'), expect.any(Number), expect.any(Number));
        expect(mockText).toHaveBeenCalledWith(expect.stringContaining('Roof Fix Project'), expect.any(Number), expect.any(Number));
        expect(mockText).toHaveBeenCalledWith(expect.stringContaining('Carlos Reparaciones'), expect.any(Number), expect.any(Number));

        // Check save
        expect(mockSave).toHaveBeenCalledWith(expect.stringMatching(/Presupuesto_Roof_Fix/));
    });

    it('should allow rejecting the quote', () => {
        render(<QuoteEvaluationView quote={mockQuote} feedbacks={[]} onAccept={mockAccept} onReject={mockReject} />);

        const rejectBtn = screen.getByText('Reject');
        fireEvent.click(rejectBtn);
        expect(mockReject).toHaveBeenCalled();
    });

    it('should allow accepting the quote', () => {
        render(<QuoteEvaluationView quote={mockQuote} feedbacks={[]} onAccept={mockAccept} onReject={mockReject} />);

        const acceptBtn = screen.getByText('Accept Proposal');
        fireEvent.click(acceptBtn);
        expect(mockAccept).toHaveBeenCalled();
    });
});
