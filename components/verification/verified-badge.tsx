'use client';

import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type BiometricStatus = 'none' | 'pending' | 'verified' | 'failed';

interface VerifiedBadgeProps {
    status: BiometricStatus;
    verifiedAt?: string | null;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function VerifiedBadge({
    status,
    verifiedAt,
    size = 'md',
    showLabel = true
}: VerifiedBadgeProps) {
    if (status === 'none') return null;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const getConfig = () => {
        switch (status) {
            case 'verified':
                return {
                    icon: ShieldCheck,
                    label: 'Verificado',
                    tooltip: verifiedAt
                        ? `Identidad verificada el ${new Date(verifiedAt).toLocaleDateString('es-AR')}`
                        : 'Identidad verificada',
                    variant: 'default' as const,
                    className: 'bg-emerald-600 hover:bg-emerald-700 text-white border-0'
                };
            case 'pending':
                return {
                    icon: Clock,
                    label: 'En Revisión',
                    tooltip: 'Verificación en proceso. Puede tomar hasta 24 horas.',
                    variant: 'secondary' as const,
                    className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200'
                };
            case 'failed':
                return {
                    icon: AlertCircle,
                    label: 'No Verificado',
                    tooltip: 'La verificación falló. Por favor, intentá nuevamente.',
                    variant: 'destructive' as const,
                    className: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-200'
                };
            default:
                return null;
        }
    };

    const config = getConfig();
    if (!config) return null;

    const Icon = config.icon;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant={config.variant}
                        className={`${sizeClasses[size]} ${config.className} flex items-center gap-1.5 font-medium cursor-help`}
                    >
                        <Icon className={iconSizes[size]} />
                        {showLabel && <span>{config.label}</span>}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-sm">{config.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
