'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminService } from '../../../services/adminService';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Pagination & Filters
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    // Meta API info
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getUsers({ page, limit, sortBy, order });
            console.log("API RESPONSE (USERS):", data);
            const usersList = data.user?.data || [];
            setUsers(usersList);
            
            const meta = data.user?.meta || {};
            setTotalPages(meta.totalPages || data.totalPages || 1);
            setTotalUsers(meta.totalUsers || 0);
            setHasNextPage(meta.hasNextPage || false);
            setHasPrevPage(meta.hasPrevPage || false);
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [page, limit, sortBy, order]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setOrder('asc');
        }
    };

    const handleFilterChange = (e, type) => {
        const val = e.target.value;
        if (type === 'limit') {
            setLimit(Number(val));
            setPage(1);
        } else if (type === 'sortBy') {
            setSortBy(val);
        } else if (type === 'order') {
            setOrder(val);
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold leading-6 text-slate-100">Users</h1>
                    <p className="mt-2 text-sm text-slate-400">A list of all users in the system.</p>
                </div>
            </div>

            <ErrorAlert message={error} />

            {/* Filters Section */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700 ring-1 ring-slate-700">
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <label htmlFor="sortBy" className="text-sm font-medium text-slate-300 whitespace-nowrap">Sort By:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => handleFilterChange(e, 'sortBy')}
                            className="block w-full rounded-md border-0 bg-slate-700 py-1.5 pl-3 pr-8 text-slate-200 ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer"
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="name">Name</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <label htmlFor="order" className="text-sm font-medium text-slate-300 whitespace-nowrap">Order:</label>
                        <select
                            id="order"
                            value={order}
                            onChange={(e) => handleFilterChange(e, 'order')}
                            className="block w-full rounded-md border-0 bg-slate-700 py-1.5 pl-3 pr-8 text-slate-200 ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer"
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                        <label htmlFor="limit" className="text-sm font-medium text-slate-300 whitespace-nowrap">Limit:</label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => handleFilterChange(e, 'limit')}
                            className="block w-full rounded-md border-0 bg-slate-700 py-1.5 pl-3 pr-8 text-slate-200 ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {loading && users.length === 0 ? (
                            <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
                        ) : (
                            <div className="overflow-hidden shadow-lg ring-1 ring-slate-700 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-800">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                                                Name {sortBy === 'name' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200 cursor-pointer hover:text-white" onClick={() => handleSort('email')}>
                                                Email {sortBy === 'email' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200 cursor-pointer hover:text-white" onClick={() => handleSort('role')}>
                                                Role {sortBy === 'role' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200 cursor-pointer hover:text-white" onClick={() => handleSort('isActive')}>
                                                Status {sortBy === 'isActive' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200 cursor-pointer hover:text-white" onClick={() => handleSort('createdAt')}>
                                                Created Date {sortBy === 'createdAt' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-200">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700 bg-slate-800">
                                        {users.map((user) => (
                                            <tr key={user.id || user._id} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-100 sm:pl-6">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{user.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                                                    <span className="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300 border border-slate-600">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${user.isActive ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-end space-x-3">
                                                    <Link 
                                                        href={`/dashboard/users/${user._id || user.id}`} 
                                                        className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link 
                                                        href={`/dashboard/users/${user._id || user.id}/wallet`} 
                                                        className="inline-flex items-center rounded-md bg-purple-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
                                                    >
                                                        Manage Wallet
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && !loading && (
                                    <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm">No records found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination UI */}
            {!loading && users.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-700 bg-slate-800 px-4 py-3 sm:px-6 mt-4 rounded-b-lg shadow ring-1 ring-slate-700">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!hasPrevPage}
                            className="relative inline-flex items-center rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={!hasNextPage}
                            className="relative ml-3 inline-flex items-center rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-300">
                                Page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-x-2" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={!hasPrevPage}
                                    className="relative inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 ring-1 ring-inset ring-slate-600 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={!hasNextPage}
                                    className="relative inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 ring-1 ring-inset ring-slate-600 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
