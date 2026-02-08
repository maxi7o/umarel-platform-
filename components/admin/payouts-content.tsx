import { PayrollService } from '@/lib/services/payroll-service';
import { PayoutTable } from '@/components/admin/payout-table';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign } from 'lucide-react';

export async function PayoutsContent() {
    let previewData = null;
    let errorMsg = null;

    try {
        const payrollService = new PayrollService();
        previewData = await payrollService.generatePayoutPreview();
    } catch (e) {
        console.error("Fetch Payroll Error:", e);
        errorMsg = "Could not generate payroll preview. Service error.";
    }

    // Default empty structure if error or null
    const safeData = previewData || {
        totalAmount: 0,
        payouts: [],
        periodStart: new Date(),
        periodEnd: new Date()
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-stone-900" />
                <h2 className="text-xl font-bold">Nómina Semanal</h2>
            </div>
            {errorMsg ? (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    Error: {errorMsg}
                </div>
            ) : (
                <PayoutTable initialData={safeData} />
            )}
        </div>
    );
}

export async function getPendingPayoutCount() {
    try {
        const payrollService = new PayrollService();
        const data = await payrollService.generatePayoutPreview();
        return data?.payouts?.length || 0;
    } catch (e) {
        return 0;
    }
}
