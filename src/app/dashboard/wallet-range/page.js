'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../services/adminService';
import Pagination from '../../../components/Pagination';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function WalletRangePage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    
    // Default range set to last 7 days
    const [start, setStart] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [end, setEnd] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const fetchRange = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getWalletRangeSummary({ start, end, page, limit });
            console.log("API RESPONSE (WALLET RANGE):", data);
            
            // Map the transaction list
            setTransactions(data.transactions || data.data || []);
            setTotalPages(data.totalPages || data.meta?.totalPages || 1);
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to fetch wallet range data');
        } finally {
            setLoading(false);
        }
    }, [start, end, page, limit]);

    useEffect(() => {
        fetchRange();
    }, [fetchRange]);

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-semibold leading-6 text-slate-100">Wallet Range Summary</h1>
                    <p className="mt-2 text-sm text-slate-400">Detailed transactions across a date range.</p>
                </div>
                <div className="mt-4 sm:flex sm:items-center sm:space-x-4 sm:mt-0">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-slate-200">From</label>
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="block rounded-md border border-slate-600 bg-slate-700 py-1.5 px-3 text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <label className="text-sm font-medium text-slate-200">To</label>
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="block rounded-md border border-slate-600 bg-slate-700 py-1.5 px-3 text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => fetchRange()}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <ErrorAlert message={error} />

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {loading && transactions.length === 0 ? (
                            <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
                        ) : (
                            <div className="overflow-hidden shadow-lg ring-1 ring-slate-700 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-800">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">Type</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Amount</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Reason</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">User ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700 bg-slate-800">
                                        {transactions.map((tx) => (
                                            <tr key={tx._id || Math.random()} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${tx.type === 'CREDIT' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-100">${parseFloat(tx.amount).toFixed(2)}</td>
                                                <td className="px-3 py-4 text-sm text-slate-300 break-words max-w-xs">{tx.reason}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{tx.userId}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {transactions.length === 0 && !loading && (
                                    <div className="text-center py-10 text-slate-400 text-sm bg-slate-800 border-t border-slate-700">No records found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Pagination page={page} limit={limit} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
