'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, User, Bot, Paperclip, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { IdeMode } from './universal-slice-ide';

interface AiAssistantPanelProps {
    mode: IdeMode;
    contextId?: string;
    isOpen: boolean;
    onToggle: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function AiAssistantPanel({
    mode,
    contextId,
    isOpen,
    onToggle
}: AiAssistantPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: getGreeting(mode),
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');

    // Update greeting when mode changes
    useEffect(() => {
        setMessages([
            {
                id: Date.now().toString(),
                role: 'assistant',
                content: getGreeting(mode),
                timestamp: new Date(),
            }
        ]);
    }, [mode]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulate AI response (to be replaced by n8n connection)
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I understand you're in **${mode.replace('_', ' ')}** mode. Let me analyze that for you... [Simulation]`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <div className="h-full flex flex-col items-center justify-start pt-4 gap-4 bg-muted/20">
                <Button variant="ghost" size="icon" onClick={onToggle}>
                    <Bot className="w-6 h-6 text-primary" />
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm relative border-r border-border/50">

            {/* 3D AVATAR PLACEHOLDER */}
            <div className="h-1/3 min-h-[200px] bg-gradient-to-b from-primary/10 to-transparent relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Replace with Spline or ReadyPlayerMe */}
                    <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                        <Bot className="w-16 h-16 text-primary" />
                    </div>
                </div>

                {/* Context Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md p-2 rounded-lg text-xs border border-border/50 shadow-sm">
                    <span className="font-semibold text-primary">Context:</span> {getAssistantContext(mode)}
                </div>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col min-h-0 bg-background/50">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                    ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                >
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>

                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm
                    ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-muted/50 text-foreground border border-border/50 rounded-tl-none'}`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>

                {/* COMPOSER */}
                <div className="p-3 border-t border-border bg-background/80 backdrop-blur-md">
                    <div className="flex gap-2 items-end">
                        <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground">
                            <Paperclip className="w-4 h-4" />
                        </Button>

                        <div className="flex-1 relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask AI or describe slice..."
                                className="pr-10 rounded-full bg-muted/30 border-transparent focus:bg-background transition-colors"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                            >
                                <Mic className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button size="icon" onClick={handleSendMessage} className="rounded-full shadow-lg shadow-primary/20">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getGreeting(mode: IdeMode): string {
    switch (mode) {
        case 'REQUEST_CREATION': return "Hola! Describe tu problema y crearé los slices por vos. ¿Qué necesitas arreglar?";
        case 'QUOTE_PROPOSAL': return "Veo 3 slices para cotizar. ¿Analizamos los precios de mercado juntos?";
        case 'EXPERIENCE_DESIGN': return "¡Diseñemos una experiencia increíble! ¿Empezamos con el horario o los cupos?";
        case 'CRITIQUE_REVIEW': return "Aquí está la evidencia del trabajo completado. ¿Ves algún defecto?";
        case 'EVIDENCE_UPLOAD': return "Subí fotos o videos para demostrar que terminaste el slice.";
        default: return "How can I help with your slices today?";
    }
}

function getAssistantContext(mode: IdeMode): string {
    switch (mode) {
        case 'REQUEST_CREATION': return "Analyzing description to generate draft slices...";
        case 'QUOTE_PROPOSAL': return "Monitoring market rates & profitability...";
        case 'EXPERIENCE_DESIGN': return "Optimizing scheduling & capacity...";
        case 'CRITIQUE_REVIEW': return "Running computer vision quality checks...";
        default: return "Standby";
    }
}
