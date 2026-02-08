/**
 * Role Switching & Demo Mode Service
 * 
 * Permite a usuarios admin cambiar entre roles para testing
 * sin necesidad de múltiples cuentas o sesiones
 */

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface RoleSwitch {
    originalUserId: string;
    currentRole: 'user' | 'admin';
    impersonatedRole?: 'client' | 'provider' | 'admin';
    timestamp: Date;
}

/**
 * Store role switch state in session/cookie
 */
export function createRoleSwitchSession(userId: string, targetRole: 'client' | 'provider' | 'admin'): RoleSwitch {
    return {
        originalUserId: userId,
        currentRole: 'admin', // Only admins can switch
        impersonatedRole: targetRole,
        timestamp: new Date(),
    };
}

/**
 * Get effective role for current user
 * If impersonating, return impersonated role
 * Otherwise return actual role
 */
export function getEffectiveRole(user: any, roleSwitch?: RoleSwitch): string {
    if (roleSwitch?.impersonatedRole) {
        return roleSwitch.impersonatedRole;
    }
    return user.role || 'user';
}

const ADMIN_EMAILS = ['admin@elentendido.ar', 'maxi7o@gmail.com'];

/**
 * Check if user can switch roles (must be admin)
 */
export async function canSwitchRoles(userId: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    const [user] = await db
        .select({
            role: users.role,
            email: users.email
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    if (user?.email && ADMIN_EMAILS.includes(user.email)) return true;

    return user?.role === 'admin';
}

/**
 * Demo personas for testing
 */
export const DEMO_PERSONAS = {
    client: {
        name: 'María Cliente',
        email: 'maria.cliente@demo.com',
        role: 'user' as const,
        scenario: 'Necesita remodelar su cocina',
        avatar: '👩‍💼',
    },
    provider: {
        name: 'Carlos Proveedor',
        email: 'carlos.proveedor@demo.com',
        role: 'user' as const,
        scenario: 'Ofrece servicios de construcción',
        avatar: '👷',
    },
    admin: {
        name: 'Admin Sistema',
        email: 'admin@demo.com',
        role: 'admin' as const,
        scenario: 'Gestiona la plataforma',
        avatar: '🛡️',
    },
    umarel: {
        name: 'Mario Entendido',
        email: 'mario.umarel@demo.com',
        role: 'user' as const,
        scenario: 'Audita y opina sobre presupuestos',
        avatar: '👴',
    },
} as const;

export type PersonaType = keyof typeof DEMO_PERSONAS;
