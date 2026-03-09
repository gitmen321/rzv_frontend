'use client';
import { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await adminService.getMe();
                setProfile(res.data);
            } catch (err) {
                const errData = await err.json?.().catch(() => ({}));
                setError(errData?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div>
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold leading-6 text-slate-100">Admin Profile</h1>
                    <p className="mt-2 text-sm text-slate-400">View your current administrator details.</p>
                </div>
            </div>

            <ErrorAlert message={error} />

            {loading ? (
                <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
            ) : profile ? (
                <div className="overflow-hidden bg-slate-800 shadow ring-1 ring-slate-700 sm:rounded-lg max-w-3xl">
                    <div className="px-4 py-6 sm:px-6">
                        <h3 className="text-base font-semibold leading-7 text-slate-200">Personal Information</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">Personal details and account status.</p>
                    </div>
                    <div className="border-t border-slate-700">
                        <dl className="divide-y divide-slate-700">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-300">Full name</dt>
                                <dd className="mt-1 text-sm leading-6 text-slate-200 sm:col-span-2 sm:mt-0">{profile.name}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-300">Email address</dt>
                                <dd className="mt-1 text-sm leading-6 text-slate-200 sm:col-span-2 sm:mt-0">{profile.email}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-300">Role</dt>
                                <dd className="mt-1 text-sm leading-6 text-slate-200 sm:col-span-2 sm:mt-0">
                                    <span className="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300 border border-slate-600">
                                        {profile.role}
                                    </span>
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-300">Account Status</dt>
                                <dd className="mt-1 text-sm leading-6 text-slate-200 sm:col-span-2 sm:mt-0">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${profile.isActive ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                                        {profile.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-300">Email Verified</dt>
                                <dd className="mt-1 text-sm leading-6 text-slate-200 sm:col-span-2 sm:mt-0">
                                    {profile.isEmailVerified ? (
                                        <span className="text-emerald-400 font-medium">Verified</span>
                                    ) : (
                                        <span className="text-amber-400 font-medium">Not Verified</span>
                                    )}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-300">Created At</dt>
                                <dd className="mt-1 text-sm leading-6 text-slate-200 sm:col-span-2 sm:mt-0">
                                    {new Date(profile.createdAt).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
