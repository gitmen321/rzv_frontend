'use client';
import { useState, useEffect } from 'react';
import { auditService } from '../../../services/auditService';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function RecentActivityPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data = await auditService.getRecentActivity();
                setActivities(data.activity || data.data || []);
            } catch (err) {
                const errData = await err.json?.().catch(() => ({}));
                setError(errData.message || 'Failed to fetch recent activity');
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    const getIconColor = (action) => {
        if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'bg-gray-400';
        if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-blue-500';
        if (action.includes('DELETE') || action.includes('DEACTIVATE')) return 'bg-red-500';
        if (action.includes('CREATE') || action.includes('ACTIVATE')) return 'bg-green-500';
        if (action.includes('WALLET')) return 'bg-purple-500';
        return 'bg-indigo-500';
    };

    return (
        <div>
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold leading-6 text-slate-100">Recent Activity</h1>
                    <p className="mt-2 text-sm text-slate-400">A timeline of the most recent administrator actions.</p>
                </div>
            </div>

            <ErrorAlert message={error} />

            {loading ? (
                <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
            ) : (
                <div className="bg-slate-800 px-4 py-5 shadow-lg sm:rounded-lg sm:px-6 border border-slate-700">
                    {activities.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">No records found</div>
                    ) : (
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {activities.map((activity, activityIdx) => (
                                    <li key={activity._id || Math.random()}>
                                        <div className="relative pb-8">
                                            {activityIdx !== activities.length - 1 ? (
                                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-700" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-slate-800 ${getIconColor(activity.action)}`}>
                                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-slate-300">
                                                            <span className="font-medium text-slate-100">
                                                                {typeof activity.adminId === 'object' ? (activity.adminId?.email || activity.adminId?._id || 'System') : (activity.adminId || 'System')}
                                                            </span> performed <span className="font-medium text-blue-400">{activity.action}</span>
                                                        </p>
                                                        {activity.targetedUserId && (
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                Targeted User: {typeof activity.targetedUserId === 'object' ? (activity.targetedUserId?.email || activity.targetedUserId?._id) : activity.targetedUserId}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-slate-400 flex flex-col items-end">
                                                        <time dateTime={activity.createdAt}>{new Date(activity.createdAt).toLocaleDateString()}</time>
                                                        <span className="text-xs">{new Date(activity.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
