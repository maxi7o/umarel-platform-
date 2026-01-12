"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { generateChallengeCode } from '@/lib/media-defense';

interface EvidenceUploaderProps {
    sliceId: string;
    sliceTitle: string;
}

export function EvidenceUploader({ sliceId, sliceTitle }: EvidenceUploaderProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [locationData, setLocationData] = useState<GeolocationCoordinates | null>(null);
    const [challengeCode, setChallengeCode] = useState<string>('');

    useEffect(() => {
        setChallengeCode(generateChallengeCode());
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));

            // Request Location on file select
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("Captured Location:", position.coords);
                        setLocationData(position.coords);
                    },
                    (error) => {
                        console.error("Location error:", error);
                        toast.warning("Para mayor seguridad, por favor habilite la ubicación.");
                    },
                    { enableHighAccuracy: true }
                );
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const { url } = await uploadRes.json();

            // 2. Submit Evidence with Trusted Metadata
            const metadata = locationData ? {
                lat: locationData.latitude,
                lng: locationData.longitude,
                accuracy: locationData.accuracy,
                altitude: locationData.altitude,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                challengeCode: challengeCode // Verify this manually or via AI later
            } : null;

            const res = await fetch(`/api/slices/${sliceId}/evidence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evidenceUrl: url,
                    description,
                    type: 'image',
                    metadata,
                    isVerified: !!locationData // Verified if browser location is present
                })
            });

            if (!res.ok) throw new Error("Submission failed");

            toast.success("Evidencia verificada y subida correctamente.");
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Error al subir evidencia.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto shadow-lg border-stone-200 dark:border-stone-800">
            <CardHeader className="bg-stone-50 dark:bg-stone-900 border-b">
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" />
                    Completar: {sliceTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Image Preview Area */}
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-stone-50 dark:bg-black/20 hover:bg-stone-100 transition-colors cursor-pointer relative overflow-hidden">
                        {preview ? (
                            <div className="relative z-10">
                                <img src={preview} alt="Evidence" className="max-h-64 object-contain" />
                                {locationData && (
                                    <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Ubicación Verificada</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-stone-500">
                                <Upload className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <span className="text-sm font-medium">Subí una foto del trabajo terminado</span>
                                <p className="text-xs text-stone-400 mt-1">Se solicitará tu ubicación para verificar la evidencia</p>
                            </div>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer h-full z-20"
                            onChange={handleFileChange}
                            required
                            capture="environment"
                        />
                    </div>

                    {/* Challenge Mode Instruction */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-orange-800">
                            <p className="font-bold mb-1">🛡️ Verificación Anti-IA Requerida</p>
                            <p>
                                Para confirmar que esta foto es real y reciente, escribí el código
                                <span className="mx-1 px-2 py-0.5 bg-white border border-orange-300 rounded font-mono font-bold text-lg text-black">{challengeCode}</span>
                                en un papel e incluilo en la foto.
                            </p>
                            <p className="text-xs mt-1 text-orange-600/80">
                                Sin este código visible, la evidencia podría ser rechazada.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                            placeholder="Detallá qué se realizó..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={!file || isUploading}
                    >
                        {isUploading ? <Loader2 className="mr-2 animate-spin" /> : "Enviar para Revisión"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
