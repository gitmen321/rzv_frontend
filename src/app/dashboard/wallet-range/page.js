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
                    <h1 className="text-xl font-semibold leading-6 text-gray-900">Wallet Range Summary</h1>
                    <p className="mt-2 text-sm text-gray-700">Detailed transactions across a date range.</p>
                </div>
                <div className="mt-4 sm:flex sm:items-center sm:space-x-4 sm:mt-0">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">From</label>
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <label className="text-sm font-medium text-gray-700">To</label>
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => fetchRange()}
                            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Type</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {transactions.map((tx) => (
                                            <tr key={tx._id || Math.random()} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">${parseFloat(tx.amount).toFixed(2)}</td>
                                                <td className="px-3 py-4 text-sm text-gray-500 break-words max-w-xs">{tx.reason}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{tx.userId}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {transactions.length === 0 && !loading && (
                                    <div className="text-center py-10 text-gray-500 text-sm border-t border-gray-200">No records found</div>
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
