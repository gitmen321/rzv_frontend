'use client';
import { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function WalletSummaryPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    useEffect(() => {
        fetchSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = () => {
        fetchSummary();
    };
    const fetchSummary = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getWalletSummary(date);
            console.log("API RESPONSE (WALLET SUMMARY):", data);
            
            // Map the data correctly to state
            setSummary({
                totalCredit: data.data?.CREDIT?.totalAmount || 0,
                totalDebit: data.data?.DEBIT?.totalAmount || 0,
                netAmount: data.meta?.netAmount || 0
            });
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to fetch wallet summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-semibold leading-6 text-gray-900">Wallet Summary</h1>
                    <p className="mt-2 text-sm text-gray-700">Financial summary for a specific date.</p>
                </div>
                <div className="mt-4 sm:flex sm:items-center sm:gap-4 sm:mt-0">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full sm:w-auto rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <button
                        onClick={handleSearch}
                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Search
                    </button>
                </div>
            </div>

            <ErrorAlert message={error} />

            {loading ? (
                <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
            ) : summary ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5 shadow sm:p-6 border border-green-100 flex items-center">
                        <div className="bg-green-100 rounded-full p-3 mr-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                        </div>
                        <div>
                            <dt className="truncate text-sm font-medium text-green-600">Total Credit</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-900">${parseFloat(summary.totalCredit || 0).toFixed(2)}</dd>
                        </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-red-50 px-4 py-5 shadow sm:p-6 border border-red-100 flex items-center">
                        <div className="bg-red-100 rounded-full p-3 mr-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                        </div>
                        <div>
                            <dt className="truncate text-sm font-medium text-red-600">Total Debit</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-900">${parseFloat(summary.totalDebit || 0).toFixed(2)}</dd>
                        </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-indigo-50 px-4 py-5 shadow sm:p-6 border border-indigo-100 flex items-center">
                        <div className="bg-indigo-100 rounded-full p-3 mr-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <dt className="truncate text-sm font-medium text-indigo-600">Net Amount</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-900">${parseFloat(summary.netAmount || 0).toFixed(2)}</dd>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg">No summary data available for this date.</div>
            )}
        </div>
    );
}
