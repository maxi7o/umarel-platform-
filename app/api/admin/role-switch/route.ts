import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canSwitchRoles, DEMO_PERSONAS, PersonaType } from '@/lib/services/role-switch-service';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Check if user can switch roles (must be admin)
        const canSwitch = await canSwitchRoles(user.id);
        if (!canSwitch) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { targetRole } = await request.json();

        if (!targetRole || !['client', 'provider', 'admin'].includes(targetRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Store role switch in cookie
        const cookieStore = await cookies();
        cookieStore.set('role_switch', JSON.stringify({
            originalUserId: user.id,
            impersonatedRole: targetRole,
            timestamp: new Date().toISOString(),
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        const persona = DEMO_PERSONAS[targetRole as PersonaType];

        return NextResponse.json({
            success: true,
            role: targetRole,
            persona,
            message: `Ahora estás viendo la plataforma como: ${persona.name} (${persona.scenario})`,
        });
    } catch (error) {
        console.error('Error switching role:', error);
        return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
    }
}

// Clear role switch
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('role_switch');

        return NextResponse.json({
            success: true,
            message: 'Volviste a tu rol original',
        });
    } catch (error) {
        console.error('Error clearing role switch:', error);
        return NextResponse.json({ error: 'Failed to clear role switch' }, { status: 500 });
    }
}

// Get current role switch state
export async function GET() {
    try {
        const cookieStore = await cookies();
        const roleSwitchCookie = cookieStore.get('role_switch');

        if (!roleSwitchCookie) {
            return NextResponse.json({ active: false });
        }

        const roleSwitch = JSON.parse(roleSwitchCookie.value);
        const persona = DEMO_PERSONAS[roleSwitch.impersonatedRole as PersonaType];

        return NextResponse.json({
            active: true,
            ...roleSwitch,
            persona,
        });
    } catch (error) {
        console.error('Error getting role switch:', error);
        return NextResponse.json({ error: 'Failed to get role switch' }, { status: 500 });
    }
}
