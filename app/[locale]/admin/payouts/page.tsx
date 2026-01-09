import { PayrollService } from '@/lib/services/payroll-service';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { PayoutTable } from '@/components/admin/payout-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default async function AdminPayoutsPage() {
    // 1. Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 2. Admin Check
    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
    if (dbUser?.role !== 'admin' && user.email !== 'carlos@demo.com') { // Allow demo admin
        redirect('/');
    }

    // 3. Fetch Data
    const payrollService = new PayrollService();
    const previewData = await payrollService.generatePayoutPreview();

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Payout Command Center</h1>
                <p className="text-muted-foreground">
                    Manage weekly dividend distributions to active community contributors.
                </p>
            </div>

            <PayoutTable initialData={previewData} />
        </div>
    );
}
