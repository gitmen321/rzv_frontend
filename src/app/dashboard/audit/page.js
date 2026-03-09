'use client';
import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../../../services/auditService';
import Pagination from '../../../components/Pagination';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(15);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [action, setAction] = useState('');
    const [adminId, setAdminId] = useState('');
    const [targetedUserId, setTargetedUserId] = useState('');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Only add non-empty filters
            const params = { page, limit };
            if (action) params.action = action;
            if (adminId) params.adminId = adminId;
            if (targetedUserId) params.targetedUserId = targetedUserId;

            const data = await auditService.getLogs(params);
            setLogs(data.logs || data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to fetch audit logs');
        } finally {
            setLoading(false);
        }
    }, [page, limit, action, adminId, targetedUserId]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold leading-6 text-slate-100">Audit Logs</h1>
                    <p className="mt-2 text-sm text-slate-400">Detailed record of all system modifications and actions.</p>
                </div>
            </div>

            <div className="mt-4 bg-slate-800 p-4 shadow-lg rounded-lg border border-slate-700 flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-200">Filter by Action</label>
                    <input
                        type="text"
                        placeholder="e.g. USER_STATUS_UPDATE"
                        value={action}
                        onChange={(e) => { setAction(e.target.value); setPage(1); }}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-slate-100 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-200">Admin ID</label>
                    <input
                        type="text"
                        placeholder="Admin ID..."
                        value={adminId}
                        onChange={(e) => { setAdminId(e.target.value); setPage(1); }}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-slate-100 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-200">Target User ID</label>
                    <input
                        type="text"
                        placeholder="Target User ID..."
                        value={targetedUserId}
                        onChange={(e) => { setTargetedUserId(e.target.value); setPage(1); }}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-slate-100 placeholder:text-slate-400"
                    />
                </div>
            </div>

            <ErrorAlert message={error} />

            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {loading && logs.length === 0 ? (
                            <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
                        ) : (
                            <div className="overflow-hidden shadow-lg ring-1 ring-slate-700 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-800">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">Admin</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Action</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Target User</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Changes</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700 bg-slate-800">
                                        {logs.map((log) => (
                                            <tr key={log._id || Math.random()} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-100 sm:pl-6">
                                                    {typeof log.adminId === 'object' ? (log.adminId?.email || log.adminId?._id || 'Unknown Admin') : (log.adminId || 'Unknown Admin')}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className="inline-flex items-center rounded-md bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-400 border border-blue-800">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                                                    {typeof log.targetedUserId === 'object' ? (log.targetedUserId?.email || log.targetedUserId?._id || '-') : (log.targetedUserId || '-')}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-slate-300">
                                                    <div className="text-xs">
                                                        {log.oldValue && <div className="text-rose-400 break-words max-w-xs">- {JSON.stringify(log.oldValue)}</div>}
                                                        {log.newValue && <div className="text-emerald-400 break-words max-w-xs mt-1">+ {JSON.stringify(log.newValue)}</div>}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(log.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {logs.length === 0 && !loading && (
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
