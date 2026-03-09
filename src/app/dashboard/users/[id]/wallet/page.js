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
                <button onClick={() => router.back()} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                    &larr; Back to Users
                </button>
            </div>

            <ErrorAlert message={error} />
            <SuccessAlert message={success} />

            {/* Profile Overview Banner */}
            {user && (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">{user.name}</h3>
                        <p className="max-w-2xl text-sm leading-6 text-gray-500">{user.email}</p>
                    </div>
                </div>
            )}

            {/* Wallet Balance Section */}
            <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-8">
                <div className="px-4 py-6 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold leading-7 text-gray-900">Wallet Balance</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        ${parseFloat(wallet.balance).toFixed(2)}
                    </div>
                </div>
            </div>

             {/* Adjust Balance Section */}
             <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Adjust Wallet Balance</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleAdjustWallet} className="grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-4 items-end">
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <select
                                value={walletType}
                                onChange={(e) => setWalletType(e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="CREDIT">CREDIT</option>
                                <option value="DEBIT">DEBIT</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={walletAmount}
                                onChange={(e) => setWalletAmount(e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Reason</label>
                            <input
                                type="text"
                                required
                                value={walletReason}
                                onChange={(e) => setWalletReason(e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            >
                                Submit Adjustment
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Transaction History</h3>
                </div>
                <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Type</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {wallet.transactions && wallet.transactions.length > 0 ? (
                                    wallet.transactions.map((tx) => (
                                        <tr key={tx._id || tx.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${parseFloat(tx.amount).toFixed(2)}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500 break-words">{tx.reason}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-6 text-sm text-gray-500">No records found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
