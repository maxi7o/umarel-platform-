'use client';

import { useState } from 'react';
import { Eye, XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RoleSwitchInfo {
    originalUserId: string;
    impersonatedRole: string;
    timestamp: string;
}

export function RoleImpersonationBar({ info }: { info: RoleSwitchInfo }) {
    const [loading, setLoading] = useState(false);

    if (!info) return null;

    const handleExit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/role-switch', { method: 'DELETE' });
            if (res.ok) {
                toast.success('Volviendo a modo Admin...');
                window.location.reload();
            } else {
                toast.error('Error al salir de la suplantación');
            }
        } catch (e) {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] bg-orange-600 text-white p-3 rounded-lg shadow-2xl border border-orange-400 flex items-center gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase opacity-80">Modo de Prueba</span>
                    <span className="font-bold text-sm">Viendo como: {info.impersonatedRole}</span>
                </div>
            </div>
            <Button
                size="sm"
                variant="secondary"
                className="bg-white text-orange-700 hover:bg-orange-50 border-0 h-8"
                onClick={handleExit}
                disabled={loading}
            >
                {loading ? <RefreshCcw className="h-3 w-3 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Salir
            </Button>
        </div>
    );
}
