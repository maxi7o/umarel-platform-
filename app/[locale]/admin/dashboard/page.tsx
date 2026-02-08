import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { AdminDashboardTabs } from '@/components/admin/admin-dashboard-tabs';
import { OverviewPanel } from '@/components/admin/overview-panel';
/* Import server components directly - Next.js App Router allows this in Server Components */
import { DisputesContent, getDisputeCount } from '@/components/admin/disputes-content';
import { PayoutsContent, getPendingPayoutCount } from '@/components/admin/payouts-content';

/* Ensure dynamic rendering for real-time admin data */
export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['admin@elentendido.ar'];

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // --- ADMIN ACCESS CHECK (ROBUST) ---
    // 1. Email Allowlist (Primary & Fail-safe)
    const isSuperAdmin = user.email && ADMIN_EMAILS.includes(user.email);
    let isAdmin = isSuperAdmin;

    // 2. Database Role Check (Secondary)
    if (!isSuperAdmin) {
        try {
            const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
            if (dbUser?.role === 'admin') {
                isAdmin = true;
            }
        } catch (e) {
            console.error("DB Admin Check Failed:", e);
            // If DB fails, rely solely on SuperAdmin (already false here)
        }
    }

    if (!isAdmin) {
        redirect('/');
    }
    // -----------------------------------

    // Parallel Data Fetching for Widget Counts
    // We wrap each in a try/catch block implicitly within their functions, but Promise.all is safe here
    // because the functions return 0 on error.
    const [disputeCount, payoutCount] = await Promise.all([
        getDisputeCount(),
        getPendingPayoutCount()
    ]);

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-archivo tracking-tight mb-2">Centro de Comando 🦉</h1>
                <p className="text-stone-500">
                    Bienvenido, Admin. Tienes <span className="font-bold text-stone-900">{disputeCount + payoutCount}</span> tareas pendientes que requieren tu atención.
                </p>
            </div>

            <AdminDashboardTabs
                overviewContent={<OverviewPanel />}
                disputesContent={<DisputesContent />}
                payoutsContent={<PayoutsContent />}
                disputeCount={disputeCount}
                pendingPayoutCount={payoutCount}
            />
        </div>
    );
}
