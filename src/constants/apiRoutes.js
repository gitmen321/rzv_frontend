export const API_ROUTES = {
    AUTH: {
        LOGIN: '/login-web',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: (token) => `/reset-password/${token}`,
        LOGOUT: '/logout',
        REFRESH_TOKEN: '/refresh-token'
    },
    ADMIN: {
        ME: '/admin/me',
        DASHBOARD_STATS: '/admin/dashboard/stats',
        USERS: '/admin/users',
        USER_DETAILS: (id) => `/admin/users/${id}`,
        USER_STATUS: (id) => `/admin/users/${id}/status`,
        USER_WALLET: (id) => `/admin/users/${id}/wallet`,
        WALLET_SUMMARY: '/admin/wallet/summary',
        WALLET_RANGE: '/admin/wallet/summary/range'
    },
    AUDIT: {
        LOGS: '/audit-logs',
        RECENT: '/recent/audit'
    }
};