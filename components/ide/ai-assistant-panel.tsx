'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, User, Bot, Paperclip, Mic, Sparkles, Zap, BrainCircuit, HardHat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, useRef } from 'react';
import { IdeMode } from './universal-slice-ide';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
    isThinking?: boolean;
}

export function AiAssistantPanel({
    mode,
    contextId,
    isOpen,
    onToggle
}: AiAssistantPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: getGreeting(mode),
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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

    const handleSendMessage = (text?: string) => {
        const content = text || inputValue;
        if (!content.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Thinking & Response
        setTimeout(() => {
            setIsTyping(false);
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getSimulatedResponse(mode, content),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5s
    };

    if (!isOpen) {
        return (
            <div className="h-full flex flex-col items-center justify-start pt-4 gap-4 bg-muted/20 border-l border-border/50">
                <Button variant="ghost" size="icon" onClick={onToggle} className="rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary/20">
                    <BrainCircuit className="w-5 h-5" />
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-card relative border-l border-border/50 shadow-xl">

            {/* HEADER: EL ENTENDIDO */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            <span className="text-2xl">👴</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-stone-900 w-3 h-3 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">El Entendido</h3>
                        <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px] h-4 px-1">{mode.replace('_', ' ')}</Badge>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-muted-foreground">
                    <Zap className="w-4 h-4" />
                </Button>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/50 relative">
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700" ref={scrollRef}>
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {msg.role === 'user' ? (
                                        <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white shadow-sm">
                                            <User size={14} />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center border border-stone-300 shadow-sm">
                                            <span className="text-sm">👴</span>
                                        </div>
                                    )}
                                </div>

                                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`px-4 py-2.5 text-sm shadow-sm relative leading-relaxed
                                            ${msg.role === 'user'
                                                ? 'bg-stone-900 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.content.split('\n').map((line, i) => (
                                            <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground px-1 opacity-70">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center border border-stone-300 shadow-sm mt-1">
                                    <span className="text-sm">👴</span>
                                </div>
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* SUGGESTED ACTIONS OVERLAY */}
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                    {getSuggestedActions(mode).map((action, i) => (
                        <Button
                            key={i}
                            variant="secondary"
                            size="sm"
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 shadow-sm text-xs h-7 whitespace-nowrap hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-colors"
                            onClick={() => handleSendMessage(action)}
                        >
                            {action}
                        </Button>
                    ))}
                </div>
            </div>

            {/* COMPOSER */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/20 transition-all">
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600">
                        <Paperclip className="w-4 h-4" />
                    </Button>

                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder={getInputPlaceholder(mode)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 max-h-32 min-h-[40px] resize-none placeholder:text-slate-400"
                        rows={1}
                        style={{ height: 'auto', minHeight: '40px' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                        }}
                    />

                    <div className="flex gap-1">
                        {!inputValue && (
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600">
                                <Mic className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            size="icon"
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() && !isTyping}
                            className={`h-9 w-9 rounded-xl transition-all ${inputValue.trim() ? 'bg-stone-900 hover:bg-stone-800 shadow-md transform hover:scale-105' : 'bg-slate-200 text-slate-400 opacity-50'}`}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>Potenciado por <strong>Umarel Intelligence™</strong></span>
                </div>
            </div>
        </div>
    );
}

// --- CONTENT HELPERS ---

function getGreeting(mode: IdeMode): string {
    switch (mode) {
        case 'REQUEST_CREATION':
            return "¡Hola vecino! 👋 Soy El Entendido. Contame qué problema tenés o qué trabajo querés hacer, y yo me encargo de armar los 'slices' para que los profesionales te coticen rápido y bien.";
        case 'QUOTE_PROPOSAL':
            return "Listo para cotizar, maestro. 🏗️ Veo el pedido del cliente. ¿Querés que analice los precios de mercado de la zona para que tu propuesta sea competitiva?";
        case 'EXPERIENCE_DESIGN':
            return "¡Qué bueno verte creando! 🎨 Vamos a diseñar una experiencia inolvidable. ¿Ya tenés en mente el título y la capacidad máxima?";
        case 'CRITIQUE_REVIEW':
            return "Llegó la hora de la verdad. 🧐 Subí las fotos del trabajo terminado. Voy a analizarlas con visión artificial para asegurarnos de que todo cumpla con los estándares.";
        case 'EVIDENCE_UPLOAD':
            return "Mostrame lo que hiciste. 📸 Subí fotos claras y contame brevemente qué vemos en cada una para liberar el pago.";
        default:
            return "¿En qué puedo ayudarte hoy?";
    }
}

function getInputPlaceholder(mode: IdeMode): string {
    switch (mode) {
        case 'REQUEST_CREATION': return "Ej: Tengo humedad en la pared del living...";
        case 'QUOTE_PROPOSAL': return "Ej: ¿Cuánto se cobra el m2 de pintura acá?";
        case 'EXPERIENCE_DESIGN': return "Ej: Taller de cerámica para 10 personas...";
        default: return "Escribí tu mensaje...";
    }
}

function getSuggestedActions(mode: IdeMode): string[] {
    switch (mode) {
        case 'REQUEST_CREATION': return ["Tengo una urgencia 🚨", "Es una remodelación planificada", "No sé bien qué es"];
        case 'QUOTE_PROPOSAL': return ["Sugerir precio de mercado", "Ver rentabilidad", "Preguntar al cliente"];
        case 'EXPERIENCE_DESIGN': return ["Sugerir horario ideal", "Calcular costos", "Ver tendencias"];
        case 'CRITIQUE_REVIEW': return ["Analizar fotos", "Generar reporte", "Aprobar todo"];
        default: return ["Ayuda", "Reiniciar"];
    }
}

function getSimulatedResponse(mode: IdeMode, input: string): string {
    const lower = input.toLowerCase();

    // REQUEST CREATION LOGIC
    if (mode === 'REQUEST_CREATION') {
        if (lower.includes('humedad') || lower.includes('agua') || lower.includes('filtración')) {
            return "Uff, la humedad es traicionera. 💧\n\nPor lo que decís, parece que vamos a necesitar:\n1. **Diagnóstico**: Encontrar de dónde viene.\n2. **Reparación**: Arreglar el caño o la grieta.\n3. **Albañilería y Pintura**: Dejar la pared como nueva.\n\n¿Te parece bien si creo estos 3 'slices' separados para que puedas ir aprobando paso a paso?";
        }
        if (lower.includes('urgencia')) {
            return "🚨 Entendido, prioridad máxima. Voy a marcar este pedido como **URGENTE**. \n\nEsto enviará una alerta a los profesionales verificado que estén a menos de 5km ahora mismo. ¿Podés subir una foto rápida del problema para que vengan preparados?";
        }
        return "Dale, contame un poco más. ¿Es en interior o exterior? ¿Hace cuánto tenés este problema?";
    }

    // QUOTE PROPOSAL LOGIC
    if (mode === 'QUOTE_PROPOSAL') {
        if (lower.includes('precio') || lower.includes('mercado')) {
            return "Estuve revisando la zona (Caballito). 🏙️\n\nPara trabajos similares:\n- **Mínimo**: $15.000 / m2\n- **Promedio**: $22.000 / m2\n- **Premium**: $35.000 / m2\n\nSi cobrás **$28.000**, estarías un 27% arriba del promedio, pero si tenés buenas calificaciones (tu Aura es alta ✨), lo valés. ¿Ponemos ese número?";
        }
        return "Perfecto. Recordá detallar qué materiales incluís. Eso reduce las preguntas del cliente en un 80%.";
    }

    return "Interesante... 🤔 Dejame procesarlo con la base de datos de Umarel. \n\n(Simulación: Acá la IA conectaría con tu backend real para ejecutar la acción solicitada).";
}
