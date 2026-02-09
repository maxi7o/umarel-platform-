'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, XCircle, AlertCircle, ArrowLeft, Shield, FileCheck, Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type BiometricStatus = 'none' | 'pending' | 'verified' | 'failed';

interface VerificationData {
    biometricStatus: BiometricStatus;
    biometricVerifiedAt: string | null;
    dniNumber: string | null;
    dniVerifiedAt: string | null;
    kycFrontPath: string | null;
    kycBackPath: string | null;
    kycSelfiePath: string | null;
}

export default function VerificationStatusPage() {
    const t = useTranslations('verification');
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [verificationData, setVerificationData] = useState<VerificationData | null>(null);

    useEffect(() => {
        fetchVerificationStatus();
    }, []);

    const fetchVerificationStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const response = await fetch('/api/verify/status');
            const data = await response.json();

            if (data.success) {
                setVerificationData(data.verification);
            }
        } catch (error) {
            console.error('Error fetching verification status:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: BiometricStatus) => {
        switch (status) {
            case 'verified':
                return {
                    icon: CheckCircle2,
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
                    borderColor: 'border-emerald-200 dark:border-emerald-800',
                    label: 'Verificado',
                    description: 'Tu identidad ha sido verificada exitosamente'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
                    borderColor: 'border-amber-200 dark:border-amber-800',
                    label: 'En Revisión',
                    description: 'Estamos verificando tu documentación. Esto puede tomar hasta 24 horas.'
                };
            case 'failed':
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50 dark:bg-red-950/20',
                    borderColor: 'border-red-200 dark:border-red-800',
                    label: 'Rechazado',
                    description: 'No pudimos verificar tu identidad. Por favor, intentá nuevamente con documentos más claros.'
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-slate-600',
                    bgColor: 'bg-slate-50 dark:bg-slate-950/20',
                    borderColor: 'border-slate-200 dark:border-slate-800',
                    label: 'No Iniciado',
                    description: 'Aún no has iniciado el proceso de verificación'
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
                <div className="animate-pulse text-stone-500">Cargando estado...</div>
            </div>
        );
    }

    if (!verificationData) {
        return (
            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-stone-600">No se pudo cargar el estado de verificación</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusConfig = getStatusConfig(verificationData.biometricStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/profile">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Perfil
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                        Estado de Verificación
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400">
                        Seguí el progreso de tu verificación de identidad
                    </p>
                </div>

                {/* Main Status Card */}
                <Card className={`mb-6 border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}>
                                <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-1">{statusConfig.label}</CardTitle>
                                <p className={`text-sm ${statusConfig.color}`}>
                                    {statusConfig.description}
                                </p>
                            </div>
                            <Badge variant={verificationData.biometricStatus === 'verified' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {/* DNI Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FileCheck className={`w-5 h-5 ${verificationData.dniNumber ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <h3 className="font-semibold text-stone-900 dark:text-stone-100">DNI</h3>
                            </div>
                            {verificationData.dniNumber ? (
                                <div>
                                    <p className="text-sm text-stone-600 dark:text-stone-400">
                                        {verificationData.dniNumber}
                                    </p>
                                    {verificationData.dniVerifiedAt && (
                                        <p className="text-xs text-emerald-600 mt-1">
                                            ✓ Verificado {new Date(verificationData.dniVerifiedAt).toLocaleDateString('es-AR')}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No proporcionado</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Camera className={`w-5 h-5 ${verificationData.kycFrontPath ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <h3 className="font-semibold text-stone-900 dark:text-stone-100">Documentos</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                    {verificationData.kycFrontPath ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-stone-600 dark:text-stone-400">Frente DNI</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {verificationData.kycBackPath ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-stone-600 dark:text-stone-400">Dorso DNI</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {verificationData.kycSelfiePath ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-stone-600 dark:text-stone-400">Selfie</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verifik Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className={`w-5 h-5 ${verificationData.biometricStatus === 'verified' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <h3 className="font-semibold text-stone-900 dark:text-stone-100">Verifik</h3>
                            </div>
                            {verificationData.biometricStatus === 'verified' ? (
                                <div>
                                    <p className="text-sm text-emerald-600 font-medium">✓ Validado</p>
                                    {verificationData.biometricVerifiedAt && (
                                        <p className="text-xs text-stone-500 mt-1">
                                            {new Date(verificationData.biometricVerifiedAt).toLocaleDateString('es-AR')}
                                        </p>
                                    )}
                                </div>
                            ) : verificationData.biometricStatus === 'pending' ? (
                                <p className="text-sm text-amber-600">En proceso...</p>
                            ) : (
                                <p className="text-sm text-slate-500">Pendiente</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">
                            ¿Qué sigue?
                        </h3>
                        {verificationData.biometricStatus === 'none' && (
                            <div className="space-y-3">
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    Para ofrecer servicios en la plataforma, necesitás verificar tu identidad.
                                </p>
                                <Link href="/verify">
                                    <Button className="w-full bg-stone-900 hover:bg-stone-800">
                                        Iniciar Verificación
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {verificationData.biometricStatus === 'pending' && (
                            <div className="space-y-3">
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    Estamos revisando tu documentación. Te notificaremos por email cuando esté lista.
                                </p>
                                <Button variant="outline" className="w-full" onClick={fetchVerificationStatus}>
                                    Actualizar Estado
                                </Button>
                            </div>
                        )}
                        {verificationData.biometricStatus === 'verified' && (
                            <div className="space-y-3">
                                <p className="text-sm text-emerald-600 font-medium">
                                    ✓ ¡Tu identidad está verificada! Ya podés ofrecer servicios.
                                </p>
                                <Link href="/create-offering">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                        Crear Perfil de Talento
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {verificationData.biometricStatus === 'failed' && (
                            <div className="space-y-3">
                                <p className="text-sm text-red-600">
                                    Hubo un problema con tu verificación. Por favor, intentá nuevamente con fotos más claras.
                                </p>
                                <Link href="/verify">
                                    <Button variant="destructive" className="w-full">
                                        Reintentar Verificación
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            ¿Necesitás ayuda?
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                            Si tenés problemas con la verificación, contactanos:
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                📧 Email Soporte
                            </Button>
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                💬 Chat en Vivo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
