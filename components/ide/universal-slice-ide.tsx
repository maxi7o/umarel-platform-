'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SliceWorkspace } from './slice-workspace';
import { AiAssistantPanel } from './ai-assistant-panel';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { PanelLeft, PanelRight, Split } from 'lucide-react';

export type IdeMode =
    | 'REQUEST_CREATION'   // Client defining needs
    | 'QUOTE_PROPOSAL'     // Provider pricing slices
    | 'EXPERIENCE_DESIGN'  // Creator making an event
    | 'CRITIQUE_REVIEW'    // Entendido evaluating evidence
    | 'EVIDENCE_UPLOAD';   // Provider proving work

interface UniversalSliceIDEProps {
    initialMode?: IdeMode;
    contextId?: string; // RequestId, ExperienceId, or QuoteId
    userRole?: 'client' | 'provider' | 'admin' | 'ai';
    existingSlices?: any[]; // Passed from server
}

export function UniversalSliceIDE({
    initialMode = 'REQUEST_CREATION',
    contextId,
    userRole,
    existingSlices = []
}: UniversalSliceIDEProps) {
    const [mode, setMode] = useState<IdeMode>(initialMode);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
    const t = useTranslations('Common'); // Assuming common translations exist

    // Layout configuration
    const aiPanelWidth = isAiPanelOpen ? 'w-1/3' : 'w-12';
    const workspaceWidth = isAiPanelOpen ? 'w-2/3' : 'w-full';

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">

            {/* 🤖 Left Panel: AI Assistant (Context) */}
            <motion.div
                className={`${aiPanelWidth} border-r border-border flex flex-col transition-all duration-300 ease-in-out relative z-10 bg-card`}
                initial={false}
                animate={{ width: isAiPanelOpen ? '33.333333%' : '3rem' }}
            >
                <div className="flex-1 overflow-hidden relative">
                    <AiAssistantPanel
                        isOpen={isAiPanelOpen}
                        mode={mode}
                        onToggle={() => setIsAiPanelOpen(!isAiPanelOpen)}
                    />
                </div>
            </motion.div>

            {/* 🛠️ Right Panel: Application Workspace (The Slices) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative z-0">

                {/* Top Header / Mode Switcher (For Dev/Demo purposes, or context switching) */}
                <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        {!isAiPanelOpen && (
                            <Button variant="ghost" size="icon" onClick={() => setIsAiPanelOpen(true)}>
                                <PanelLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {mode.replace('_', ' ')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dev Mode Switcher */}
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as IdeMode)}
                            className="bg-transparent border border-border rounded-md text-sm p-1"
                        >
                            <option value="REQUEST_CREATION">Request Creation</option>
                            <option value="QUOTE_PROPOSAL">Quote Proposal</option>
                            <option value="EXPERIENCE_DESIGN">Experience Design</option>
                            <option value="CRITIQUE_REVIEW">Critique Review</option>
                        </select>
                    </div>
                </header>

                {/* Workspace Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                    <SliceWorkspace
                        mode={mode}
                        contextId={contextId}
                        existingSlices={existingSlices}
                    />
                </main>

            </div>
        </div>
    );
}
