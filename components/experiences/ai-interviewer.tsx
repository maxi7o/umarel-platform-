'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, SendHorizontal, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface Message {
    id: string;
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

interface AIInterviewerProps {
    experienceId: string;
    experienceTitle: string;
    initialQuestions: string[];
    basePrice: number;
}

export function AIInterviewer({ experienceId, experienceTitle, initialQuestions, basePrice }: AIInterviewerProps) {
    const router = useRouter();
    // const t = useTranslations('booking');

    // State
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'ai',
            content: `Hello! I'm here to help you get ready for **${experienceTitle}**. To ensure the host can give you the best experience, I have a few quick questions.`,
            timestamp: new Date()
        },
        {
            id: 'init-2',
            role: 'ai',
            content: initialQuestions[0] || "What are you looking forward to the most?",
            timestamp: new Date(Date.now() + 500)
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false); // When AI is satisfied
    const [bookingSummary, setBookingSummary] = useState<any>(null); // To store final quote
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);


    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Call API
            const response = await fetch(`/api/experiences/${experienceId}/interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: messages
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            // Check if AI signals completion
            if (data.isComplete) {
                setIsComplete(true);
                setBookingSummary(data.bookingSummary);
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.message,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error('Chat error:', error);
            // Fallback error message
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'ai',
                content: "I'm having trouble connecting to the server. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleProceedToPayment = async () => {
        // Redirect to Join API to create escrow
        try {
            const res = await fetch(`/api/experiences/${experienceId}/join`, {
                method: 'POST'
            });
            const data = await res.json();
            if (data.paymentId) {
                // In a real flow, this redirects to MercadoPago or Stripe
                router.push(`/checkout/${data.paymentId}`);
            }
        } catch (e) {
            console.error('Join error', e);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col shadow-lg border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-purple-600" />

            <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Concierge
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden bg-stone-50/50">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4 pb-4">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar className={`w-8 h-8 ${msg.role === 'ai' ? 'bg-purple-100' : 'bg-stone-200'}`}>
                                    {msg.role === 'ai' ? (
                                        <div className="flex items-center justify-center w-full h-full text-purple-600">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <AvatarFallback>You</AvatarFallback>
                                    )}
                                </Avatar>

                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-white shadow-sm border border-stone-100 text-stone-700 rounded-tl-none'
                                    }`}>
                                    {/* Simple Markdown Rendering Support could go here */}
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <Avatar className="w-8 h-8 bg-purple-100">
                                    <div className="flex items-center justify-center w-full h-full text-purple-600">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                </Avatar>
                                <div className="bg-white shadow-sm border border-stone-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Completion Overlay */}
                <AnimatePresence>
                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t p-6 shadow-2xl z-10"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900">You're all set!</h4>
                                    <p className="text-sm text-stone-600">We have everything we need.</p>
                                </div>
                            </div>

                            <div className="bg-stone-50 p-3 rounded-lg border mb-4 flex justify-between items-center">
                                <span className="text-stone-600 text-sm">Total Quote</span>
                                <span className="font-bold text-lg">${(basePrice / 100).toFixed(2)}</span>
                            </div>

                            <Button onClick={handleProceedToPayment} size="lg" className="w-full gap-2 font-bold shadow-lg shadow-primary/20">
                                <Ticket className="w-4 h-4" />
                                Proceed to Payment
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="p-3 border-t bg-white">
                <form
                    className="flex w-full gap-2 relative"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isComplete ? "Booking complete" : "Type your answer..."}
                        disabled={isTyping || isComplete}
                        className="pr-12 bg-stone-50 border-stone-200 focus-visible:ring-purple-500"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isTyping || isComplete}
                        className="absolute right-1 top-1 h-8 w-8 bg-purple-600 hover:bg-purple-700"
                    >
                        {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
