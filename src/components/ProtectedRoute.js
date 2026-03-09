'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return <>{children}</>;
}
