'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Briefcase,
    Shield,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface Persona {
    name: string;
    email: string;
    role: string;
    scenario: string;
    avatar: string;
}

interface RoleSwitchState {
    active: boolean;
    impersonatedRole?: string;
    persona?: Persona;
}

export function RoleSwitcher() {
    const [currentSwitch, setCurrentSwitch] = useState<RoleSwitchState>({ active: false });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCurrentSwitch();
    }, []);

    const fetchCurrentSwitch = async () => {
        try {
            const response = await fetch('/api/admin/role-switch');
            const data = await response.json();
            setCurrentSwitch(data);
        } catch (error) {
            console.error('Error fetching role switch:', error);
        }
    };

    const switchRole = async (targetRole: 'client' | 'provider' | 'admin') => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/role-switch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetRole }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setCurrentSwitch({
                    active: true,
                    impersonatedRole: targetRole,
                    persona: data.persona,
                });
                // Reload page to apply new role
                setTimeout(() => window.location.reload(), 500);
            } else {
                toast.error(data.error || 'Error al cambiar rol');
            }
        } catch (error) {
            console.error('Error switching role:', error);
            toast.error('Error al cambiar rol');
        } finally {
            setLoading(false);
        }
    };

    const clearSwitch = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/role-switch', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setCurrentSwitch({ active: false });
                // Reload page to restore original role
                setTimeout(() => window.location.reload(), 500);
            } else {
                toast.error(data.error || 'Error al restaurar rol');
            }
        } catch (error) {
            console.error('Error clearing role switch:', error);
            toast.error('Error al restaurar rol');
        } finally {
            setLoading(false);
        }
    };

    const personas = [
        {
            id: 'client',
            name: 'María Cliente',
            icon: <User className="h-5 w-5" />,
            color: 'bg-blue-500',
            description: 'Necesita remodelar su cocina',
            avatar: '👩‍💼',
        },
        {
            id: 'provider',
            name: 'Carlos Proveedor',
            icon: <Briefcase className="h-5 w-5" />,
            color: 'bg-stone-900',
            description: 'Ofrece servicios de construcción',
            avatar: '👷',
        },
        {
            id: 'umarel',
            name: 'Mario Entendido',
            icon: <Shield className="h-5 w-5" />,
            color: 'bg-amber-500',
            description: 'Audita y opina sobre presupuestos',
            avatar: '👴',
        },
        {
            id: 'admin',
            name: 'Admin Sistema',
            icon: <Shield className="h-5 w-5" />,
            color: 'bg-purple-500',
            description: 'Gestiona la plataforma',
            avatar: '🛡️',
        },
    ];

    return (
        <Card className="border-2 border-stone-300 bg-stone-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-stone-900" />
                            Role Switcher (Testing Mode)
                        </CardTitle>
                        <CardDescription>
                            Cambia entre roles para probar flujos completos sin múltiples cuentas
                        </CardDescription>
                    </div>
                    {currentSwitch.active && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSwitch}
                            disabled={loading}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Volver a Admin
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {currentSwitch.active && currentSwitch.persona && (
                    <div className="mb-6 p-4 bg-white border-2 border-stone-300 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">{currentSwitch.persona.avatar}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="h-4 w-4 text-stone-900" />
                                    <span className="font-semibold">Viendo como: {currentSwitch.persona.name}</span>
                                </div>
                                <p className="text-sm text-stone-600">{currentSwitch.persona.scenario}</p>
                            </div>
                            <Badge variant="outline" className="bg-stone-100 text-stone-900 border-stone-300">
                                {currentSwitch.impersonatedRole}
                            </Badge>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                    {personas.map((persona) => (
                        <Card
                            key={persona.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${currentSwitch.impersonatedRole === persona.id
                                ? 'ring-2 ring-orange-500 bg-stone-50'
                                : 'hover:border-stone-300'
                                }`}
                            onClick={() => switchRole(persona.id as any)}
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="text-5xl">{persona.avatar}</div>
                                    <div className={`p-3 rounded-full ${persona.color} text-white`}>
                                        {persona.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{persona.name}</h3>
                                        <p className="text-xs text-stone-600">{persona.description}</p>
                                    </div>
                                    {currentSwitch.impersonatedRole === persona.id && (
                                        <Badge className="bg-orange-500">Activo</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-stone-50 border border-stone-300 rounded-lg">
                    <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-stone-900 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-semibold mb-1">Cómo funciona:</p>
                            <ul className="list-disc list-inside space-y-1 text-stone-900">
                                <li>Hacé click en un rol para cambiar tu vista</li>
                                <li>La página se recargará automáticamente</li>
                                <li>Verás la plataforma como ese usuario vería</li>
                                <li>Podés crear requests, quotes, etc. como ese rol</li>
                                <li>Click en "Volver a Admin" para restaurar</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
