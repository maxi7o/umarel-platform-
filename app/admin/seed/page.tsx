"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SeedPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'umarel2025') {
            setIsAuthenticated(true);
        } else {
            alert('Contraseña incorrecta');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setProgress(0);
        setResult(null);

        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',');

            const requests = lines.slice(1).map((line, index) => {
                const values = line.split(',');
                const obj: any = {};
                headers.forEach((header, i) => {
                    obj[header.trim()] = values[i]?.trim() || '';
                });

                // Simulate progress
                setProgress(Math.round(((index + 1) / (lines.length - 1)) * 50));

                return {
                    title: obj.title,
                    description: obj.description,
                    category: obj.category,
                    location: obj.location,
                    budgetMin: parseInt(obj.budgetMin) || 0,
                    budgetMax: parseInt(obj.budgetMax) || 0,
                    createdAt: obj.createdAt,
                    status: obj.status || 'open',
                };
            });

            // Send to API
            const response = await fetch('/api/admin/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requests }),
            });

            setProgress(100);

            if (response.ok) {
                const data = await response.json();
                setResult({
                    success: true,
                    message: `✅ ${data.count} pedidos importados exitosamente!`,
                    count: data.count
                });
            } else {
                const error = await response.json();
                setResult({
                    success: false,
                    message: `❌ Error: ${error.error || 'Error desconocido'}`
                });
            }
        } catch (error) {
            setResult({
                success: false,
                message: `❌ Error al procesar el archivo: ${error}`
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Admin - Seed Database</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Contraseña</label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingrese contraseña"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Ingresar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-6 w-6" />
                            Importar Pedidos desde CSV
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Seleccionar archivo CSV
                            </label>
                            <Input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            {file && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Archivo seleccionado: {file.name}
                                </p>
                            )}
                        </div>

                        <Button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="w-full"
                            size="lg"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importando... {progress}%
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload & Seed 150 Requests
                                </>
                            )}
                        </Button>

                        {isUploading && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}

                        {result && (
                            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-start gap-3">
                                    {result.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    )}
                                    <div>
                                        <p className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                                            {result.message}
                                        </p>
                                        {result.success && result.count && (
                                            <p className="text-sm text-green-700 mt-1">
                                                Los pedidos ya están disponibles en /browse
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                            <p className="font-medium">Formato esperado del CSV:</p>
                            <code className="block bg-gray-100 p-2 rounded text-xs">
                                title,description,category,location,budgetMin,budgetMax,createdAt,status
                            </code>
                            <p className="text-xs">
                                El archivo debe tener exactamente estos headers y datos válidos en cada fila.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
