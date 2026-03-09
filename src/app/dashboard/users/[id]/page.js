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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Status update modal state
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const [userData] = await Promise.all([
                adminService.getUserDetails(id)
            ]);
            console.log("API RESPONSE (USER DETAIL):", userData);
            setUser(userData.user || userData.data?.user || userData);
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
            setError(errData?.message || 'Failed to update user status');
        }
    };



    if (loading) return <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>;
    if (!user) return <div className="py-12 text-center text-gray-500">User not found</div>;

    return (
        <div>
            <div className="mb-6">
                <button onClick={() => router.back()} className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center transition-colors">
                    &larr; Back to Users
                </button>
            </div>

            <ErrorAlert message={error} />
            <SuccessAlert message={success} />

            {/* Profile Section */}
            <div className="overflow-hidden bg-slate-800 border border-slate-700 shadow-lg sm:rounded-lg mb-8">
                <div className="px-4 py-6 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-semibold leading-7 text-slate-100">User Information</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">Personal details and status.</p>
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
                <div className="border-t border-slate-700">
                    <dl className="divide-y divide-slate-700">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-slate-200">Full name</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-300 sm:col-span-2 sm:mt-0">{user.name}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-slate-200">Email address</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-300 sm:col-span-2 sm:mt-0">{user.email}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-slate-200">Role</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-300 sm:col-span-2 sm:mt-0">{user.role}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-slate-200">Status</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-300 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${user.isActive ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-slate-200">Email Verified</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-300 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${user.isEmailVerified ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                                    {user.isEmailVerified ? 'Yes' : 'No'}
                                </span>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-slate-200">Created At</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-300 sm:col-span-2 sm:mt-0">{new Date(user.createdAt).toLocaleString()}</dd>
                        </div>
                    </dl>
                </div>
            </div>


            <ConfirmModal
                isOpen={isStatusModalOpen}
                title={`${user.isActive ? 'Deactivate' : 'Activate'} User`}
                message={`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`}
                confirmText="Yes, proceed"
                confirmColor={user.isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}
                onConfirm={handleToggleStatus}
                onCancel={() => setIsStatusModalOpen(false)}
            />


        </div>
    );
}
