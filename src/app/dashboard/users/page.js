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
            console.log("API RESPONSE (USERS):", data);
            const usersList = data.user?.data || data.users || [];
            setUsers(usersList);
            setTotalPages(data.user?.meta?.totalPages || data.totalPages || 1);
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [page, limit, sortBy, order, search]);

    useEffect(() => {
        // debounce search
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delaySearch);
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
            
            <div className="mt-4 sm:flex gap-4">
                <div className="w-full sm:max-w-xs">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            id="search"
                            name="search"
                            type="search"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
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
                                                Created At {sortBy === 'createdAt' && (order === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">View</span>
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
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link href={`/dashboard/users/${user._id || user.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        View<span className="sr-only">, {user.name}</span>
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
