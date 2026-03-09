'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '../../../../services/adminService';
import ErrorAlert from '../../../../components/ErrorAlert';
import SuccessAlert from '../../../../components/SuccessAlert';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import ConfirmModal from '../../../../components/ConfirmModal';

export default function UserDetailsPage({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Status update modal state
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    
    // Wallet adjustment modal state
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [walletAmount, setWalletAmount] = useState('');
    const [walletType, setWalletType] = useState('CREDIT');
    const [walletReason, setWalletReason] = useState('');

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const [userData, walletData] = await Promise.all([
                adminService.getUserDetails(id),
                adminService.getUserWallet(id).catch(() => ({ balance: 0, transactions: [] })) // In case wallet API fails individually
            ]);
            console.log("API RESPONSE (USER):", userData);
            console.log("API RESPONSE (WALLET):", walletData);
            setUser(userData.user || userData.data?.user || userData);
            setWallet(walletData.wallet || walletData.data?.wallet || walletData);
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const newStatus = !user.isActive;
            const data = await adminService.updateUserStatus(id, newStatus);
            setUser({ ...user, isActive: newStatus });
            setSuccess(data.message || 'User status updated successfully');
            setIsStatusModalOpen(false);
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to update user status');
        }
    };

    const handleAdjustWallet = async (e) => {
        e.preventDefault();
        try {
            const data = await adminService.adjustWallet(id, {
                amount: parseFloat(walletAmount),
                type: walletType,
                reason: walletReason
            });
            setSuccess(data.message || 'Wallet adjusted successfully');
            setIsWalletModalOpen(false);
            setWalletAmount('');
            setWalletReason('');
            fetchUserDetails(); // Refresh data to get new transactions
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to adjust wallet');
        }
    };

    if (loading) return <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>;
    if (!user) return <div className="py-12 text-center text-gray-500">User not found</div>;

    return (
        <div>
            <div className="mb-6">
                <button onClick={() => router.back()} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                    &larr; Back to Users
                </button>
            </div>

            <ErrorAlert message={error} />
            <SuccessAlert message={success} />

            {/* Profile Section */}
            <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-8">
                <div className="px-4 py-6 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">User Information</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and status.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsStatusModalOpen(true)}
                            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${user.isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
                        >
                            {user.isActive ? 'Deactivate User' : 'Activate User'}
                        </button>
                    </div>
                </div>
                <div className="border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Full name</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Email address</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Role</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.role}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Status</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Joined</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{new Date(user.createdAt).toLocaleString()}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Wallet Section */}
            {wallet && (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-6 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-base font-semibold leading-7 text-gray-900">Wallet Details</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Balance and transaction history.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-xl font-bold text-gray-900">
                                Balance: ${parseFloat(wallet.balance).toFixed(2)}
                            </div>
                            <button
                                onClick={() => setIsWalletModalOpen(true)}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Adjust Wallet
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-gray-100">
                        {/* Transactions Table */}
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
                                    {(wallet.transactions || []).length > 0 ? (
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
            )}

            <ConfirmModal
                isOpen={isStatusModalOpen}
                title={`${user.isActive ? 'Deactivate' : 'Activate'} User`}
                message={`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`}
                confirmText="Yes, proceed"
                confirmColor={user.isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}
                onConfirm={handleToggleStatus}
                onCancel={() => setIsStatusModalOpen(false)}
            />

            {/* Wallet Modal */}
            {isWalletModalOpen && (
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <form onSubmit={handleAdjustWallet}>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                                <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Adjust Wallet Balance</h3>
                                                <div className="mt-4 space-y-4">
                                                    <div>
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
                                                    <div>
                                                        <label className="block text-sm font-medium leading-6 text-gray-900">Amount</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            required
                                                            value={walletAmount}
                                                            onChange={(e) => setWalletAmount(e.target.value)}
                                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium leading-6 text-gray-900">Reason</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={walletReason}
                                                            onChange={(e) => setWalletReason(e.target.value)}
                                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setIsWalletModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
