'use client';
import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardCharts from '../../components/dashboard/DashboardCharts';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                console.log("API RESPONSE (STATS):", data);
                setStats(data);
            } catch (err) {
                const errData = await err.json?.().catch(() => ({}));
                setError(errData.message || 'Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>;

    const cards = [
        { name: 'Total Users', stat: stats?.users?.total || 0, icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: 'bg-indigo-500' },
        { name: 'Active Users', stat: stats?.users?.active || 0, icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-500' },
        { name: 'Inactive Users', stat: stats?.users?.inActive || 0, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', color: 'bg-red-500' },
        { name: 'New Users Today', stat: stats?.users?.newToday || 0, icon: 'M12 4.5v15m7.5-7.5h-15', color: 'bg-blue-500' },
        { name: 'Wallet Balance', stat: typeof stats?.wallet?.totalBalance === 'number' ? `${stats.wallet.totalBalance.toFixed(2)}` : '0.00', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-purple-500' },
    ];

    return (
        <div className="p-6 gap-6">
            <h2 className="text-2xl font-bold leading-7 text-slate-100 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
                Dashboard Overview
            </h2>

            <ErrorAlert message={error} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
                {cards.map((item) => (
                    <div key={item.name} className="relative overflow-hidden rounded-lg bg-slate-800 border border-slate-700 px-4 pb-12 pt-5 shadow-lg sm:px-6 sm:pt-6">
                        <dt>
                            <div className={`absolute rounded-md p-3 ${item.color}`}>
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-slate-400">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-2xl font-semibold text-slate-100">{item.stat}</p>
                        </dd>
                    </div>
                ))}
            </div>

            {stats?.transactionsToday && (
                <div className="mt-8 bg-slate-800 border border-slate-700 shadow-lg rounded-lg px-6 py-6">
                    <h3 className="text-lg leading-6 font-medium text-slate-100 mb-4">Today's Transactions Overview</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-emerald-900/30 rounded-md p-4 flex items-center justify-between border border-emerald-800">
                            <div>
                                <p className="text-sm font-medium text-emerald-400">Total Credit</p>
                                <p className="mt-1 text-2xl font-semibold text-emerald-300">
                                    {stats.transactionsToday.CREDIT?.totalAmount !== undefined ? stats.transactionsToday.CREDIT.totalAmount.toFixed(2) : '0.00'}
                                </p>
                            </div>
                            <div className="bg-emerald-800/50 rounded-full p-2">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                            </div>
                        </div>
                        <div className="bg-rose-900/30 rounded-md p-4 flex items-center justify-between border border-rose-800">
                            <div>
                                <p className="text-sm font-medium text-rose-400">Total Debit</p>
                                <p className="mt-1 text-2xl font-semibold text-rose-300">
                                    {stats.transactionsToday.DEBIT?.totalAmount !== undefined ? stats.transactionsToday.DEBIT.totalAmount.toFixed(2) : '0.00'}
                                </p>
                            </div>
                            <div className="bg-rose-800/50 rounded-full p-2">
                                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <DashboardCharts stats={stats} />
        </div>
    );
}