'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '../../../../../services/adminService';
import ErrorAlert from '../../../../../components/ErrorAlert';
import SuccessAlert from '../../../../../components/SuccessAlert';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

export default function UserWalletPage({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Wallet adjustment modal state
    const [walletAmount, setWalletAmount] = useState('');
    const [walletType, setWalletType] = useState('CREDIT');
    const [walletReason, setWalletReason] = useState('');

    const fetchUserWallet = async () => {
        setLoading(true);
        setError('');
        try {
            const walletData = await adminService.getUserWallet(id);
            console.log("API RESPONSE (WALLET DETAIL):", walletData);
            setUser(walletData.data?.user || walletData.user || null);
            setWallet(walletData.data?.wallet || walletData.wallet || { balance: 0 });
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData?.message || 'Failed to fetch user wallet');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserWallet();
    }, [id]);

    const handleAdjustWallet = async (e) => {
        e.preventDefault();
        try {
            const data = await adminService.adjustWallet(id, {
                amount: parseFloat(walletAmount),
                type: walletType,
                reason: walletReason
            });
            setSuccess(data?.message || 'Wallet adjusted successfully');
            setWalletAmount('');
            setWalletReason('');
            fetchUserWallet(); // Refresh data to get new transactions and balance
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData?.message || 'Failed to adjust wallet');
        }
    };

    if (loading) return <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>;
    if (!wallet) return <div className="py-12 text-center text-gray-500">Wallet not found</div>;

    return (
        <div>
            <div className="mb-6">
                <button onClick={() => router.back()} className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center transition-colors">
                    &larr; Back to Users
                </button>
            </div>

            <ErrorAlert message={error} />
            <SuccessAlert message={success} />

            {/* Profile Overview Banner */}
            {user && (
                <div className="overflow-hidden bg-slate-800 border border-slate-700 shadow-lg sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-base font-semibold leading-7 text-slate-100">{user.name}</h3>
                        <p className="max-w-2xl text-sm leading-6 text-slate-400">{user.email}</p>
                    </div>
                </div>
            )}

            {/* Wallet Balance Section */}
            <div className="overflow-hidden bg-slate-800 border border-slate-700 shadow-lg sm:rounded-lg mb-8">
                <div className="px-4 py-6 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold leading-7 text-slate-100">Wallet Balance</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-100">
                        ${parseFloat(wallet.balance).toFixed(2)}
                    </div>
                </div>
            </div>

             {/* Adjust Balance Section */}
             <div className="overflow-hidden bg-slate-800 border border-slate-700 shadow-lg sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-700">
                    <h3 className="text-base font-semibold leading-7 text-slate-100">Adjust Wallet Balance</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleAdjustWallet} className="grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-4 items-end">
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-slate-200">Type</label>
                            <select
                                value={walletType}
                                onChange={(e) => setWalletType(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-slate-600 bg-slate-700 py-1.5 pl-3 pr-10 text-slate-100 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                            >
                                <option value="CREDIT">CREDIT</option>
                                <option value="DEBIT">DEBIT</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-slate-200">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={walletAmount}
                                onChange={(e) => setWalletAmount(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-slate-600 bg-slate-700 py-1.5 px-3 text-slate-100 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-slate-200">Reason</label>
                            <input
                                type="text"
                                required
                                value={walletReason}
                                onChange={(e) => setWalletReason(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-slate-600 bg-slate-700 py-1.5 px-3 text-slate-100 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-500 transition-colors"
                            >
                                Submit Adjustment
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="overflow-hidden bg-slate-800 border border-slate-700 shadow-lg sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-7 text-slate-100">Transaction History</h3>
                </div>
                <div className="border-t border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">Type</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Amount</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Reason</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 bg-slate-800">
                                {wallet.transactions && wallet.transactions.length > 0 ? (
                                    wallet.transactions.map((tx) => (
                                        <tr key={tx._id || tx.id} className="hover:bg-slate-700/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${tx.type === 'CREDIT' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">${parseFloat(tx.amount).toFixed(2)}</td>
                                            <td className="px-3 py-4 text-sm text-slate-300 break-words">{tx.reason}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(tx.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-6 text-sm text-slate-400 bg-slate-800 border-t border-slate-700">No records found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
