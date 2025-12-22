"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, Loader2, ChevronRight, ChevronLeft, Paperclip, Plus } from 'lucide-react';
import { SliceCard } from './slice-card';
import { MessageThread } from './message-thread';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WizardInterfaceProps {
    sliceId: string;
    requestId: string;
    locale?: string;
    currentUser: {
        id: string;
        name: string;
        auraLevel: string;
    };
}

export function WizardInterface({ sliceId, requestId, currentUser, locale = 'en' }: WizardInterfaceProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [sliceCards, setSliceCards] = useState<any[]>([]); // TODO: Import SliceCard type
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAskingNext, setIsAskingNext] = useState(false);
    const [isSliceCardCollapsed, setIsSliceCardCollapsed] = useState(false);
    const [questionQueue, setQuestionQueue] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = locale === 'es' ? {
        title: 'Asistente',
        subtitle: 'Ayuda a la comunidad a ganar dinero haciendo este trabajo más barato y claro',
        earningsBanner: (amount: string) => `🔥 Los mejores umarels hoy ganaron ${amount} – tú también puedes, solo compartiendo conocimiento`,
        inputPlaceholder: 'Responde la pregunta o agrega información adicional...',
        helpText: '💬 Puedes responder la pregunta del asistente, agregar información adicional sobre tu solicitud, o hacer preguntas. El asistente se adaptará a lo que compartas.',
        askNext: 'Pregúntame qué sigue',
        thinking: 'Pensando...',
        previousQuestion: 'Pregunta anterior',
        currentQuestion: 'Pregunta actual',
        nextQuestion: 'Siguiente pregunta',
        skip: 'Saltar',
        skipWizard: 'Saltar asistente y publicar',
        attachFiles: 'Adjuntar archivos',
        filesAttached: (count: number) => `${count} archivo${count > 1 ? 's' : ''} adjunto${count > 1 ? 's' : ''}`,
        noQuestions: 'No hay preguntas pendientes',
        projectSlices: 'Partes del Proyecto',
    } : {
        title: 'Assistant',
        subtitle: 'Help the community earn money by making this job cheaper and clearer',
        earningsBanner: (amount: string) => `🔥 Top umarels today earned ${amount} – you can too, just by sharing knowledge`,
        inputPlaceholder: 'Answer the question or add additional information...',
        helpText: '💬 You can answer the assistant\'s question, add additional information about your request, or ask questions. The assistant will adapt to what you share.',
        askNext: 'Ask me what\'s next',
        thinking: 'Thinking...',
        previousQuestion: 'Previous question',
        currentQuestion: 'Current question',
        nextQuestion: 'Next question',
        skip: 'Skip',
        skipWizard: 'Skip assistant and publish',
        attachFiles: 'Attach files',
        filesAttached: (count: number) => `${count} file${count > 1 ? 's' : ''} attached`,
        noQuestions: 'No pending questions',
        projectSlices: 'Project Slices',
    };

    const hasInitiated = useRef(false);

    // Load wizard state on mount
    useEffect(() => {
        loadWizardState();
    }, [sliceId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadWizardState = async () => {
        try {
            const response = await fetch(`/api/wizard/${sliceId}`);
            const data = await response.json();
            console.log('Wizard data loaded:', data);

            if (data.sliceCards) {
                setSliceCards(data.sliceCards);
                // Set initial active card (first one)
                if (data.sliceCards.length > 0) {
                    setActiveCardId(data.sliceCards[0].id);
                }
            }

            setMessages(data.messages || []);

            // Extract questions if AI message exists
            if (data.messages && data.messages.length > 0) {
                const lastAiMessage = [...data.messages].reverse().find((m: any) => m.role === 'assistant');
                if (lastAiMessage) {
                    extractQuestions(lastAiMessage.content);
                }
            } else {
                // --- AUTO-START WIZARD ---
                // Avoid race conditions with double-useEffect in Strict Mode
                if (!hasInitiated.current) {
                    hasInitiated.current = true;
                    setTimeout(() => {
                        initiateWizardConversation(data.sliceCards || []);
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Failed to load wizard state:', error);
        }
    };

    const initiateWizardConversation = async (cards: any[]) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/wizard/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sliceId,
                    content: "INITIAL_ANALYSIS_TRIGGER", // Triggers AI analysis without user message
                    currentSliceCards: cards,
                    locale,
                }),
            });
            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, data.message]);
                extractQuestions(data.message.content);
            }
        } catch (error) {
            console.error('Failed to init wizard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractQuestions = (content: string) => {
        // Extract all questions from AI message
        const questionMatches = content.match(/[¿][^¿?]+[?]/g);
        if (questionMatches && questionMatches.length > 0) {
            setQuestionQueue(questionMatches);
            setCurrentQuestionIndex(0);
        } else {
            // English/General Fallback: Match sentences ending in ?
            // Look for a capital letter, followed by non-sentence-ending punctuation, ending in ?
            // This avoids catching ", ink?" as a question.
            const enQuestionMatches = content.match(/[A-Z][^.!?]*\?/g);
            if (enQuestionMatches && enQuestionMatches.length > 0) {
                setQuestionQueue(enQuestionMatches.map(q => q.trim()));
                setCurrentQuestionIndex(0);
            }
        }
    };

    // ... navigateQuestion, skipCurrentQuestion, handleFileSelect remain same ...
    const navigateQuestion = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (direction === 'next' && currentQuestionIndex < questionQueue.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const skipCurrentQuestion = () => {
        if (currentQuestionIndex < questionQueue.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // No more questions, ask for next
            askNext();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachedFiles(Array.from(e.target.files));
        }
    };

    const sendMessage = async () => {
        if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            userId: currentUser.id,
            createdAt: new Date(),
            attachments: attachedFiles.map(f => f.name),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setAttachedFiles([]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/wizard/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sliceId,
                    content: input,
                    currentSliceCards: sliceCards, // Send ALL cards
                    attachments: attachedFiles.map(f => f.name),
                    locale, // Send locale
                }),
            });

            const data = await response.json();

            // Update slice cards if changed
            if (data.sliceCards) {
                setSliceCards(data.sliceCards);
                // If a new card was added, switch to it? Or keep current?
                // For now, keep current unless it didn't exist
                if (activeCardId && !data.sliceCards.find((c: any) => c.id === activeCardId)) {
                    setActiveCardId(data.sliceCards[0]?.id || null);
                }
            }

            // Add AI response
            if (data.message) {
                setMessages(prev => [...prev, data.message]);
                extractQuestions(data.message.content);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const askNext = async () => {
        // ... kept similar but maybe needs to send all cards ...
        setIsAskingNext(true);
        try {
            // Re-using message endpoint for "smart" next step might be better
            // relying on standard chat flow. But if we need explicit "Check Logic":
            const response = await fetch('/api/wizard/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sliceId,
                    content: "What should I do next? Is there anything missing?", // Trigger AI
                    currentSliceCards: sliceCards
                }),
            });
            const data = await response.json();
            // ... handle response same as sendMessage ...
            if (data.sliceCards) setSliceCards(data.sliceCards);
            if (data.message) {
                setMessages(prev => [...prev, data.message]);
                extractQuestions(data.message.content);
            }

        } catch (error) {
            console.error('Failed to get suggestion:', error);
        } finally {
            setIsAskingNext(false);
        }
    };


    const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSkipWizard = () => setIsSkipDialogOpen(true);
    const confirmSkip = () => window.location.href = `/${locale}/browse`;

    // Calculate active slices
    const activeSlice = sliceCards.find(c => c.id === activeCardId) || sliceCards[0];

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Header */}
            <div className="border-b bg-white dark:bg-gray-900">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 px-6 py-2 text-center text-sm font-medium text-orange-800 dark:text-orange-200 border-b border-orange-200 dark:border-orange-800">
                    {t.earningsBanner('$1,250,000')}
                </div>

                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t.title}</h1>
                        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                    </div>
                    <Button onClick={handleSkipWizard} variant="outline">
                        {t.skipWizard} →
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex">
                {/* Left: Message Thread */}
                <div className={`flex-1 overflow-y-auto p-6 transition-all ${isSliceCardCollapsed ? 'mr-0' : ''}`}>
                    {/* Project Context Header */}
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                {locale === 'es' ? 'Solicitud Original' : 'Original Request'}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {sliceCards[0]?.title || '...'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                            {sliceCards[0]?.description || '...'}
                        </p>
                    </div>

                    <MessageThread
                        messages={messages}
                        currentUserId={currentUser.id}
                    />
                    <div ref={messagesEndRef} />
                </div>

                {/* Right: Slice Cards */}
                <div className={`border-l bg-gray-50 dark:bg-gray-900 transition-all flex flex-col ${isSliceCardCollapsed ? 'w-12' : 'w-96'}`}>
                    {isSliceCardCollapsed ? (
                        <button
                            onClick={() => setIsSliceCardCollapsed(false)}
                            className="w-full h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900">
                                <h3 className="font-semibold text-sm">{t.projectSlices} ({sliceCards.length})</h3>
                                <button
                                    onClick={() => setIsSliceCardCollapsed(true)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Tabs for multiple slices */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {sliceCards.length > 1 ? (
                                    <Tabs value={activeCardId || undefined} onValueChange={setActiveCardId} className="w-full">
                                        <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent justify-start mb-4">
                                            {sliceCards.map((card, index) => (
                                                <TabsTrigger
                                                    key={card.id}
                                                    value={card.id}
                                                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
                                                >
                                                    {card.title || `Slice ${index + 1}`}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>

                                        {sliceCards.map((card) => (
                                            <TabsContent key={card.id} value={card.id} className="mt-0">
                                                <SliceCard
                                                    sliceCard={card}
                                                    onUpdate={(updated) => {
                                                        setSliceCards(cards => cards.map(c => c.id === updated.id ? updated : c));
                                                    }}
                                                    isLocked={card.isLocked}
                                                />
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                ) : (
                                    activeSlice && (
                                        <SliceCard
                                            sliceCard={activeSlice}
                                            onUpdate={(updated) => {
                                                setSliceCards(cards => cards.map(c => c.id === updated.id ? updated : c));
                                            }}
                                            isLocked={activeSlice.isLocked}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom: Input (Identical to before) */}
            <div className="border-t bg-white dark:bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto space-y-3">
                    {/* Question Carousel */}
                    {questionQueue.length > 0 && (
                        <div className="relative">
                            <div className="flex items-center gap-3">
                                {/* Previous */}
                                <button
                                    onClick={() => navigateQuestion('prev')}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex-1 text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 hover:opacity-75 transition-opacity disabled:opacity-25 disabled:cursor-not-allowed hidden sm:block"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">{t.previousQuestion}</p>
                                    <p className="text-sm line-clamp-2">
                                        {currentQuestionIndex > 0 ? questionQueue[currentQuestionIndex - 1] : t.noQuestions}
                                    </p>
                                </button>

                                {/* Current */}
                                <div className="flex-[2] p-4 rounded-lg border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">{t.currentQuestion}</p>
                                            </div>
                                            <p className="text-base font-medium text-blue-900 dark:text-blue-100">
                                                {questionQueue[currentQuestionIndex]}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={skipCurrentQuestion}
                                            className="shrink-0"
                                        >
                                            {t.skip} →
                                        </Button>
                                    </div>
                                </div>

                                {/* Next */}
                                <button
                                    onClick={() => navigateQuestion('next')}
                                    disabled={currentQuestionIndex >= questionQueue.length - 1}
                                    className="flex-1 text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 hover:opacity-75 transition-opacity disabled:opacity-25 disabled:cursor-not-allowed hidden sm:block"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">{t.nextQuestion}</p>
                                    <p className="text-sm line-clamp-2">
                                        {currentQuestionIndex < questionQueue.length - 1 ? questionQueue[currentQuestionIndex + 1] : t.noQuestions}
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={t.inputPlaceholder}
                                className="min-h-[60px] resize-none"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                size="icon"
                                title={t.attachFiles}
                            >
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Button
                                onClick={sendMessage}
                                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                                size="icon"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {/* File attachments preview */}
                    {attachedFiles.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                            <span>{t.filesAttached(attachedFiles.length)}: {attachedFiles.map(f => f.name).join(', ')}</span>
                            <Button variant="ghost" size="sm" onClick={() => setAttachedFiles([])}>
                                ✕
                            </Button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx"
                    />

                    {!input.trim() && (
                        <Button
                            onClick={askNext}
                            disabled={isAskingNext || sliceCards.length === 0}
                            variant="outline"
                            className="w-full"
                        >
                            {isAskingNext ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t.thinking}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    {t.askNext}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={isSkipDialogOpen} onOpenChange={setIsSkipDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {locale === 'es' ? '¿Estás seguro de saltar?' : 'Are you sure you want to skip?'}
                        </DialogTitle>
                        <DialogDescription>
                            {locale === 'es'
                                ? 'El Asistente Umarel te ayuda a ahorrar hasta un 30% definiendo mejor tu pedido. Si saltas ahora, publicarás la solicitud tal como está.'
                                : 'The Umarel Assistant helps you save up to 30% by better defining your request. If you skip now, you will publish the request as is.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsSkipDialogOpen(false)}>
                            {locale === 'es' ? 'Volver al Asistente' : 'Back to Wizard'}
                        </Button>
                        <Button variant="destructive" onClick={confirmSkip}>
                            {locale === 'es' ? 'Saltar y Publicar' : 'Skip and Publish'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
