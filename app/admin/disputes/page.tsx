
import { getDisputes } from '../actions';
import { redirect } from 'next/navigation';

export default async function AdminDisputesPage() {
    const disputes = await getDisputes();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">🚨 Dispute War Room</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slice</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {disputes.map((dispute) => (
                            <tr key={dispute.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{dispute.title}</div>
                                    <div className="text-sm text-gray-500">ID: {dispute.id.substring(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    ${(dispute.finalPrice || 0) / 100} ARS
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dispute.disputedAt ? new Date(dispute.disputedAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button className="text-green-600 hover:text-green-900">Resolve (Pay)</button>
                                    <button className="text-red-600 hover:text-red-900">Refund Client</button>
                                </td>
                            </tr>
                        ))}
                        {disputes.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    No active disputes. All quiet on the western front. 🕊️
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
