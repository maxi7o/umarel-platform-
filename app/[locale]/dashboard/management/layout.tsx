import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardManagementLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not authenticated
        redirect(`/${locale}/auth/login?redirect=/dashboard/management`);
    }

    // Check if user is admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userData?.role !== 'admin') {
        // Redirect to home if not admin
        redirect(`/${locale}`);
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {children}
        </div>
    );
}
