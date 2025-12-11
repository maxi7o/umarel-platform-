"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EvidenceViewerProps {
    evidence: {
        fileUrl: string;
        description?: string | null;
        createdAt: Date | null;
        providerName?: string;
    } | null;
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps) {
    if (!evidence) {
        return (
            <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-stone-50 dark:bg-stone-900">
                Aún no hay evidencia subida.
            </div>
        );
    }

    return (
        <Card className="shadow-sm border-stone-200 dark:border-stone-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                    <span>Prueba del Trabajo</span>
                    <Badge variant="secondary">Verificación Pendiente</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-black/5 rounded-lg overflow-hidden flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={evidence.fileUrl}
                        alt="Evidence"
                        className="max-h-[400px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                </div>
                {evidence.description && (
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-md text-sm italic border">
                        "{evidence.description}"
                    </div>
                )}
                <div className="text-xs text-muted-foreground text-right">
                    Subido el {evidence.createdAt ? new Date(evidence.createdAt).toLocaleDateString() : ''}
                </div>
            </CardContent>
        </Card>
    );
}
