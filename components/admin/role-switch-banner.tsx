'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleSwitchState {
    active: boolean;
    impersonatedRole?: string;
    persona?: {
        name: string;
        avatar: string;
    };
}

export function RoleSwitchBanner() {
    const [roleSwitch, setRoleSwitch] = useState<RoleSwitchState>({ active: false });
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        fetchRoleSwitch();
    }, []);

    const fetchRoleSwitch = async () => {
        try {
            const response = await fetch('/api/admin/role-switch');
            const data = await response.json();
            setRoleSwitch(data);
        } catch (error) {
            console.error('Error fetching role switch:', error);
        }
    };

    const clearSwitch = async () => {
        try {
            await fetch('/api/admin/role-switch', { method: 'DELETE' });
            window.location.reload();
        } catch (error) {
            console.error('Error clearing role switch:', error);
        }
    };

    if (!roleSwitch.active || !visible) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5" />
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">MODO TESTING:</span>
                            <span>Viendo como</span>
                            <Badge className="bg-white text-orange-600 hover:bg-white">
                                {roleSwitch.persona?.avatar} {roleSwitch.persona?.name}
                            </Badge>
                            <span className="text-sm opacity-90">
                                ({roleSwitch.impersonatedRole})
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSwitch}
                            className="bg-white text-orange-600 hover:bg-orange-50 border-white"
                        >
                            Volver a Admin
                        </Button>
                        <button
                            onClick={() => setVisible(false)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            aria-label="Ocultar banner"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
