'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminService } from '../../../services/adminService';
import Pagination from '../../../components/Pagination';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getUsers({ page, limit, sortBy, order });
            console.log("API RESPONSE (USERS):", data);
            const usersList = data.user?.data || [];
            setUsers(usersList);
            setTotalPages(data.user?.meta?.totalPages || data.totalPages || 1);
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

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold leading-6 text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all users in the system.</p>
                </div>
            </div>

            <ErrorAlert message={error} />

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {loading && users.length === 0 ? (
                            <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
                        ) : (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer" onClick={() => handleSort('name')}>
                                                Name {sortBy === 'name' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('email')}>
                                                Email {sortBy === 'email' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('role')}>
                                                Role {sortBy === 'role' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('isActive')}>
                                                Status {sortBy === 'isActive' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('createdAt')}>
                                                Created Date {sortBy === 'createdAt' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-end space-x-3">
                                                    <Link 
                                                        href={`/dashboard/users/${user._id || user.id}`} 
                                                        className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link 
                                                        href={`/dashboard/users/${user._id || user.id}/wallet`} 
                                                        className="inline-flex items-center rounded-md bg-purple-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                                                    >
                                                        Manage Wallet
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && !loading && (
                                    <div className="text-center py-10 text-gray-500 text-sm">No records found</div>
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
