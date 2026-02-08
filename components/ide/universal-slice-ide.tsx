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
    const aiPanelWidth = isAiPanelOpen ? 'md:w-1/2 w-full' : 'md:w-16 w-12';

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">

            {/* 🛠️ Main Workspace (Left - 50%) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative z-0 w-full transition-all duration-300">

                {/* Header moved inside workspace */}
                <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {mode.replace('_', ' ')}
                        </h2>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                    <SliceWorkspace
                        mode={mode}
                        contextId={contextId}
                        existingSlices={existingSlices}
                    />
                </main>
            </div>


            {/* 🤖 AI Assistant (Right - 50%) */}
            <motion.div
                className={`border-l border-border flex flex-col transition-all duration-300 ease-in-out relative z-10 bg-card h-full shadow-xl`}
                initial={false}
                animate={{ width: isAiPanelOpen ? '50%' : '0rem', opacity: isAiPanelOpen ? 1 : 0 }}
                style={{ minWidth: isAiPanelOpen ? '400px' : '0px' }}
            >
                <div className="flex-1 overflow-hidden relative h-full">
                    <AiAssistantPanel
                        isOpen={isAiPanelOpen}
                        mode={mode}
                        onToggle={() => setIsAiPanelOpen(!isAiPanelOpen)}
                    />
                </div>
            </motion.div>

        </div>
    );
}


