'use client';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { setAccessToken } from '../services/api';

export default function Navbar({ title, adminMenuOpen, setAdminMenuOpen, profile }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error(e);
        } finally {
            setAccessToken(null);
            router.push('/login');
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {title || 'Dashboard'}
            </h1>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"></div>

                <div className="relative">
                    <button
                        type="button"
                        className="-m-1.5 flex items-center p-1.5"
                        id="user-menu-button"
                        aria-expanded={adminMenuOpen}
                        aria-haspopup="true"
                        onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                            {profile?.name ? profile.name.charAt(0) : 'A'}
                        </div>
                        <span className="hidden lg:flex lg:items-center">
                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{profile?.name || 'Admin'}</span>
                            <svg className="ml-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>

                    {adminMenuOpen && (
                        <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                                role="menuitem"
                                tabIndex="-1"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
