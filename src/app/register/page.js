'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/authService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessData(null);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await authService.register(form);
            setSuccessData(data);
        } catch (err) {
            try {
                const errData = await err.json();
                setError(errData?.message || 'Registration failed. Please try again.');
            } catch {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "block w-full rounded-md border border-slate-600 bg-slate-700 py-2 px-3 text-slate-100 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6";
    const labelClass = "block text-sm font-medium leading-6 text-slate-200 mb-1";

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* Icon */}
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-slate-100">
                    User Registration <span className="text-purple-400">(Demo Only)</span>
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    This registration is for creating test users so they can appear in the admin dashboard.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-slate-800 border border-slate-700 px-6 py-10 shadow-lg sm:rounded-lg sm:px-12">

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 rounded-md bg-rose-900/40 border border-rose-700 px-4 py-3 text-sm text-rose-300">
                            {error}
                        </div>
                    )}

                    {/* Success Result */}
                    {successData ? (
                        <div className="space-y-4">
                            <div className="rounded-md bg-emerald-900/40 border border-emerald-700 px-4 py-3 text-sm text-emerald-300">
                                ✅ {successData.message || 'Verification email sent. Please verify your email.'}
                            </div>

                            {(successData.demo?.verifyToken || successData.newEmail) && (
                                <div className="rounded-md bg-slate-700 border border-slate-600 px-4 py-4 space-y-2">
                                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Demo Verification Token</p>
                                    {successData.newEmail && (
                                        <p className="text-sm text-slate-300">
                                            <span className="text-slate-500">Email:</span> {successData.newEmail}
                                        </p>
                                    )}
                                    {successData.demo?.verifyToken && (
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Token (for testing email verification):</p>
                                            <p className="text-xs font-mono break-all bg-slate-900 rounded p-2 text-amber-400 select-all">
                                                {successData.demo.verifyToken}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => { setSuccessData(null); setForm({ name:'', email:'', password:'', confirmPassword:'', referralCode:'' }); }}
                                className="mt-2 w-full text-center text-sm text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                Register another user
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className={labelClass}>Full Name</label>
                                <input
                                    id="name" name="name" type="text"
                                    required autoComplete="name"
                                    placeholder="John Doe"
                                    value={form.name} onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className={labelClass}>Email Address</label>
                                <input
                                    id="email" name="email" type="email"
                                    required autoComplete="email"
                                    placeholder="john@example.com"
                                    value={form.email} onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className={labelClass}>Password</label>
                                <input
                                    id="password" name="password" type="password"
                                    required autoComplete="new-password"
                                    placeholder="Min. 8 characters"
                                    value={form.password} onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                                <input
                                    id="confirmPassword" name="confirmPassword" type="password"
                                    required autoComplete="new-password"
                                    placeholder="Re-enter password"
                                    value={form.confirmPassword} onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Referral Code */}
                            <div>
                                <label htmlFor="referralCode" className={labelClass}>
                                    Referral Code <span className="text-slate-500 font-normal">(optional)</span>
                                </label>
                                <input
                                    id="referralCode" name="referralCode" type="text"
                                    placeholder="Leave blank if none"
                                    value={form.referralCode} onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Submit */}
                            <div className="pt-1">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : 'Create Demo Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Back to login */}
                    <div className="mt-6 text-center text-sm text-slate-400">
                        <Link href="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
