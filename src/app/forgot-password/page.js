'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/authService';
import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [demoToken, setDemoToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setDemoToken(null);
        setIsLoading(true);

        try {
            const data = await authService.forgotPassword(email);
            setSuccess(data.message || 'Reset link sent successfully.');
            // For Demo mode, capture token
            if (data.demo?.resetToken) {
                setDemoToken(data.demo.resetToken);
            }
        } catch (err) {
            const errData = await err.json?.().catch(() => ({}));
            setError(errData.message || 'Enter a valid email address.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email to receive a password reset link.
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <ErrorAlert message={error} />
                    <SuccessAlert message={success} />
                    
                    {!success && !demoToken ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                >
                                    {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : 'Send reset instructions'}
                                </button>
                            </div>
                        </form>
                    ) : demoToken && (
                        <div className="mt-6 text-center">
                            <Link 
                                href={`/reset-password/${demoToken}`}
                                className="inline-flex items-center justify-center w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                Continue to Reset Password (Demo)
                            </Link>
                        </div>
                    )}
                    
                    <div className="mt-6 text-center text-sm">
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
