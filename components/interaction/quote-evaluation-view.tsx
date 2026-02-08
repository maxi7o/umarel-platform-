
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Check, X, MessageSquare, AlertTriangle, ShieldCheck, FileText, Download } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import jsPDF from 'jspdf';

// Types (Move to shared types ideally)
interface Quote {
    id: string;
    amount: number;
    currency: string;
    message: string;
    provider: {
        id: string;
        fullName: string;
        avatarUrl?: string;
        auraPoints: number;
    };
    createdAt: string;
}

interface Feedback {
    id: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    sentiment: 'positive' | 'negative' | 'neutral' | 'warning';
    isVerified: boolean; // Passed AI Consensus
    createdAt: string;
}

interface QuoteEvaluationViewProps {
    quote: Quote;
    feedbacks: Feedback[]; // Pre-fetched feedback
    requestTitle?: string; // Added for PDF context
    requestLocation?: string; // Added for PDF context
    onAccept: () => void;
    onReject: () => void;
}

export function QuoteEvaluationView({ quote, feedbacks, requestTitle = "Proyecto Sin Título", requestLocation, onAccept, onReject }: QuoteEvaluationViewProps) {
    const t = useTranslations(); // Assumes configured, fallback handled if missing keys

    const handleExportPdf = () => {
        const doc = new jsPDF();

        // --- HEADER ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40); // Dark Grey
        doc.text("Presupuesto / Cotización", 20, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100); // Light Grey
        doc.text("Generado por El Entendido - Plataforma de Transparencia", 20, 26);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 32, 190, 32);

        // --- PROJECT INFO ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Detalles del Proyecto", 20, 42);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Título: ${requestTitle}`, 20, 48);
        if (requestLocation) doc.text(`Ubicación: ${requestLocation}`, 20, 54);

        // --- PROVIDER INFO ---
        doc.setFont("helvetica", "bold");
        doc.text("Proveedor Verificado", 120, 42);

        doc.setFont("helvetica", "normal");
        doc.text(`Nombre: ${quote.provider.fullName}`, 120, 48);
        doc.text(`Nivel de Aura: ${quote.provider.auraPoints}`, 120, 54); // Could add visual stars later?

        doc.line(20, 62, 190, 62);

        // --- QUOTE CONTENT ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Propuesta Técnica y Económica", 20, 72);

        const splitText = doc.splitTextToSize(quote.message || "Sin descripción detallada.", 170);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(splitText, 20, 80);

        // --- TOTAL ---
        let yPos = 80 + (splitText.length * 5) + 20;

        // Draw a box for the total
        doc.setFillColor(245, 247, 250); // Light blueish/grey
        doc.rect(110, yPos - 10, 80, 20, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        const totalString = `Total: ${formatCurrency(quote.amount / 100, quote.currency)}`;
        doc.text(totalString, 185, yPos + 3, { align: "right" });

        // --- FOOTER / TRANSPARENCY PITCH ---
        // This is key for the User's request about procurement managers
        const pageHeight = doc.internal.pageSize.height;

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);

        const footerText1 = "Este documento certifica una cotización gestionada a través de El Entendido.";
        const footerText2 = "Usar nuestra plataforma garantiza transparencia, trazabilidad y reduce riesgos en la contratación.";
        const footerText3 = "Visita elentendido.ar para verificar este proveedor y acceder a beneficios de gestión.";

        doc.text(footerText1, 105, pageHeight - 20, { align: "center" });
        doc.text(footerText2, 105, pageHeight - 16, { align: "center" });
        doc.text(footerText3, 105, pageHeight - 12, { align: "center" });

        doc.save(`Presupuesto_${requestTitle.substring(0, 10).replace(/\s/g, '_')}_${quote.provider.fullName.split(' ')[0]}.pdf`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* LEFT: The Quote (Document) */}
            <div className="md:col-span-2 space-y-4">
                <Card className="h-full border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-slate-200">
                                <AvatarImage src={quote.provider.avatarUrl} />
                                <AvatarFallback>{quote.provider.fullName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">
                                    {quote.provider.fullName}
                                </CardTitle>
                                <CardDescription className="text-xs flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-blue-500" />
                                    Aura: {quote.provider.auraPoints}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-slate-900 block">
                                {formatCurrency(quote.amount / 100, quote.currency)}
                            </span>
                            <span className="text-xs text-slate-500">Total Estimated</span>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[150px]">
                            {quote.message}
                        </div>

                        <div className="mt-8 flex gap-3 justify-end items-center">
                            <Button
                                variant="outline"
                                className="text-slate-600 hover:bg-slate-50 border-slate-200 gap-2 mr-auto"
                                onClick={handleExportPdf}
                                title="Descargar orden de compra lista para presentar"
                            >
                                <FileText className="w-4 h-4 text-slate-500" />
                                Exportar PDF
                            </Button>

                            <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-100" onClick={onReject}>
                                <X className="w-4 h-4 mr-2" /> Reject
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200" onClick={onAccept}>
                                <Check className="w-4 h-4 mr-2" /> Accept Proposal
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT: The Entendido Sidebar (Margin Notes) */}
            <div className="md:col-span-1">
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl h-full flex flex-col">
                    <div className="p-4 border-b border-yellow-100 bg-yellow-50 rounded-t-xl flex items-center justify-between">
                        <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Expert Opinions
                        </h3>
                        <Badge variant="secondary" className="bg-white text-yellow-700 hover:bg-white">{feedbacks.length}</Badge>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {feedbacks.length === 0 ? (
                                <div className="text-center py-8 text-yellow-600/60 text-sm italic">
                                    No opinions yet. <br /> Request a review from the community?
                                    <Button variant="link" className="text-yellow-700 h-auto p-0 ml-1">Ask now</Button>
                                </div>
                            ) : (
                                feedbacks.map((fb) => (
                                    <div key={fb.id} className="bg-white p-3 rounded-lg shadow-sm border border-yellow-100/50 hover:shadow-md transition-shadow relative group">
                                        <div className="flex items-start gap-2 mb-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={fb.authorAvatar} />
                                                <AvatarFallback className="text-[9px] bg-yellow-100 text-yellow-700">{fb.authorName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{fb.authorName}</p>
                                                <p className="text-[10px] text-slate-400">{format(new Date(fb.createdAt), 'MMM d, HH:mm')}</p>
                                            </div>
                                            {fb.isVerified && (
                                                <div title="AI Verified Safe" className="bg-green-100 text-green-700 p-0.5 rounded-full">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {fb.content}
                                        </p>

                                        {/* Sentiment Indicator Stripe */}
                                        <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full 
                                            ${fb.sentiment === 'positive' ? 'bg-green-400' :
                                                fb.sentiment === 'negative' ? 'bg-red-400' :
                                                    fb.sentiment === 'warning' ? 'bg-orange-400' : 'bg-slate-300'}`}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

// Icon for verified check
function CheckCircle2({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
