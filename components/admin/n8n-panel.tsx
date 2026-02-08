'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Rocket, Settings2, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const PRESETS = {
    scout: {
        name: 'Explorador Social (Scout)',
        url: '', // User to fill or env
        payload: {
            "keywords": ["reformas", "plomero", "albañil"],
            "platforms": ["instagram", "facebook"],
            "location": "Buenos Aires",
            "max_results": 20,
            "sentiment_filter": "negative_or_question"
        }
    },
    onboarding: {
        name: 'Mail de Bienvenida (Test)',
        url: '',
        payload: {
            "email": "test@elentendido.ar",
            "name": "Usuario Prueba",
            "role": "provider"
        }
    }
};

export function N8nPanel() {
    const [webhookUrl, setWebhookUrl] = useState('');
    const [payload, setPayload] = useState(JSON.stringify(PRESETS.scout.payload, null, 2));
    const [loading, setLoading] = useState(false);
    const [responseLog, setResponseLog] = useState<string | null>(null);

    const handlePresetChange = (key: keyof typeof PRESETS) => {
        setPayload(JSON.stringify(PRESETS[key].payload, null, 2));
        toast.info(`Cargado preset: ${PRESETS[key].name}`);
    };

    const handleExecute = async () => {
        if (!webhookUrl) {
            toast.error('Por favor ingresá la URL del Webhook de n8n');
            return;
        }

        try {
            JSON.parse(payload);
        } catch (e) {
            toast.error('El JSON de parámetros es inválido');
            return;
        }

        setLoading(true);
        setResponseLog(null);

        try {
            // We proxy via our own API to avoid CORS issues and hide tokens if backend-stored
            const res = await fetch('/api/admin/n8n/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: webhookUrl,
                    payload: JSON.parse(payload)
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al ejecutar workflow');

            setResponseLog(JSON.stringify(data, null, 2));
            toast.success('Workflow disparado exitosamente 🚀');

        } catch (error: any) {
            setResponseLog(`ERROR: ${error.message}`);
            toast.error('Falló la ejecución');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Rocket className="h-5 w-5 text-stone-900" />
                <h2 className="text-xl font-bold">Consola de Inteligencia Artificial (n8n)</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Configuración de Misión</CardTitle>
                        <CardDescription>Parámetros de entrada para el Agente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Presets Rápidos</Label>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePresetChange('scout')}>
                                    📡 Scout Social
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handlePresetChange('onboarding')}>
                                    📧 Email Test
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">Webhook URL (n8n)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="url"
                                    placeholder="https://n8n.elentendido.ar/webhook/..."
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    type="password" // Hide mostly
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">La URL debe ser accesible públicamente.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payload">Parámetros (JSON)</Label>
                            <Textarea
                                id="payload"
                                className="font-mono text-xs h-64 bg-slate-50"
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                            />
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleExecute} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            Disparar Workflow
                        </Button>
                    </CardContent>
                </Card>

                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Registro de Operaciones</CardTitle>
                        <CardDescription>Salida del sistema en tiempo real</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <div className="bg-slate-950 text-green-400 font-mono text-xs p-4 rounded-md h-full w-full overflow-auto shadow-inner">
                            <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
                                <Terminal className="h-3 w-3" />
                                <span>terminal_output.log</span>
                            </div>
                            {loading ? (
                                <div className="space-y-1 animate-pulse">
                                    <p>{'>'} Iniciando conexión segura...</p>
                                    <p>{'>'} Enviando payload...</p>
                                    <p>{'>'} Esperando respuesta del agente...</p>
                                </div>
                            ) : responseLog ? (
                                <pre className="whitespace-pre-wrap">{responseLog}</pre>
                            ) : (
                                <p className="text-slate-600 italic">Esperando comando...</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
