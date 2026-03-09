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
                    <h1 className="text-xl font-semibold leading-6 text-gray-900">Audit Logs</h1>
                    <p className="mt-2 text-sm text-gray-700">Detailed record of all system modifications and actions.</p>
                </div>
            </div>

            <div className="mt-4 bg-white p-4 shadow rounded-lg border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Filter by Action</label>
                    <input
                        type="text"
                        placeholder="e.g. USER_STATUS_UPDATE"
                        value={action}
                        onChange={(e) => { setAction(e.target.value); setPage(1); }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border ring-1 ring-inset ring-gray-300"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Admin ID</label>
                    <input
                        type="text"
                        placeholder="Admin ID..."
                        value={adminId}
                        onChange={(e) => { setAdminId(e.target.value); setPage(1); }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border ring-1 ring-inset ring-gray-300"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Target User ID</label>
                    <input
                        type="text"
                        placeholder="Target User ID..."
                        value={targetedUserId}
                        onChange={(e) => { setTargetedUserId(e.target.value); setPage(1); }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border ring-1 ring-inset ring-gray-300"
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
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Admin</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Target User</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Changes</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {logs.map((log) => (
                                            <tr key={log._id || Math.random()} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {typeof log.adminId === 'object' ? (log.adminId?.email || log.adminId?._id || 'Unknown Admin') : (log.adminId || 'Unknown Admin')}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {typeof log.targetedUserId === 'object' ? (log.targetedUserId?.email || log.targetedUserId?._id || '-') : (log.targetedUserId || '-')}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-xs">
                                                        {log.oldValue && <div className="text-red-500 break-words max-w-xs">- {JSON.stringify(log.oldValue)}</div>}
                                                        {log.newValue && <div className="text-green-500 break-words max-w-xs mt-1">+ {JSON.stringify(log.newValue)}</div>}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {logs.length === 0 && !loading && (
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
