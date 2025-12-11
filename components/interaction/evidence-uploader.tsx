"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
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

            // 2. Submit Evidence
            const res = await fetch(`/api/slices/${sliceId}/evidence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evidenceUrl: url,
                    description,
                    type: 'image'
                })
            });

            if (!res.ok) throw new Error("Submission failed");

            toast.success("Evidencia subida correctamente.");
            router.refresh(); // Or redirect

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
                            <img src={preview} alt="Evidence" className="max-h-64 object-contain z-10" />
                        ) : (
                            <div className="text-stone-500">
                                <Upload className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <span className="text-sm font-medium">Subí una foto del trabajo terminado</span>
                            </div>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer h-full z-20"
                            onChange={handleFileChange}
                            required
                        />
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
