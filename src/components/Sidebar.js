'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        name: 'Users',
        href: '/dashboard/users',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <circle cx="9" cy="7" r="3.5"/>
                <path d="M2.5 20.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" strokeLinecap="round"/>
                <path d="M17 11c1.657 0 3 1.343 3 3" strokeLinecap="round"/>
                <path d="M19 20.5c0-2.485-1.343-4.5-3-4.5" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        name: 'Wallet Summary',
        href: '/dashboard/wallet-summary',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <rect x="2" y="7" width="20" height="13" rx="2.5"/>
                <path d="M16 13.5a1 1 0 100 2 1 1 0 000-2z" fill="currentColor" stroke="none"/>
                <path d="M2 10.5h20" strokeLinecap="round"/>
                <path d="M6 4l4-2 4 2 4-2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        name: 'Wallet Range',
        href: '/dashboard/wallet-range',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <path d="M3 4h18M3 9h18M3 14h10M3 19h7" strokeLinecap="round"/>
                <circle cx="18.5" cy="17" r="3.5"/>
                <path d="M21 19.5l1.5 1.5" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        name: 'Audit Logs',
        href: '/dashboard/audit',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <path d="M9 12h6M9 16h4M7 4H5.5A2.5 2.5 0 003 6.5v13A2.5 2.5 0 005.5 22h13a2.5 2.5 0 002.5-2.5V8l-5-4H7z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 4v4h4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        name: 'Recent Activity',
        href: '/dashboard/recent-activity',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                <circle cx="12" cy="8" r="3.5"/>
                <path d="M4.5 20.5C4.5 17.186 7.91 15 12 15s7.5 2.186 7.5 5.5" strokeLinecap="round"/>
            </svg>
        ),
    },
];

// Coin SVG icon for the logo
function CoinIcon() {
    return (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-amber-500/30 ring-1 ring-amber-400/40 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.15)"/>
                <circle cx="12" cy="12" r="7" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
                <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">₿</text>
            </svg>
        </div>
    );
}

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
            <div
                className="flex grow flex-col gap-y-5 overflow-y-auto px-4 pb-4"
                style={{
                    background: 'linear-gradient(180deg, #0f1629 0%, #0d1321 100%)',
                    borderRight: '1px solid rgba(99,102,241,0.15)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
                }}
            >
                {/* Logo / Title */}
                <div className="flex h-16 shrink-0 items-center gap-x-3 mt-1">
                    <CoinIcon />
                    <div className="flex flex-col leading-none">
                        <span className="text-base font-black tracking-tight text-white">RZV <span className="text-indigo-400">Admin</span></span>
                        <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Control Panel</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -mt-2" />

                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`
                                            group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150
                                            ${isActive
                                                ? 'bg-indigo-600/20 text-indigo-300 shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-500/25'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {/* Icon wrapper */}
                                        <span className={`
                                            flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-150
                                            ${isActive
                                                ? 'bg-indigo-500/25 text-indigo-300 shadow-inner shadow-indigo-500/20'
                                                : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-200'
                                            }
                                        `}>
                                            {item.icon}
                                        </span>
                                        {item.name}
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow shadow-indigo-400/60" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
