import { fetchApi } from './api';
import { API_ROUTES } from '../constants/apiRoutes';

export const adminService = {
    getMe: async () => {
        const response = await fetchApi(API_ROUTES.ADMIN.ME);
        if (!response.ok) throw response;
        return response.json();
    },

    getDashboardStats: async () => {
        const response = await fetchApi(API_ROUTES.ADMIN.DASHBOARD_STATS);
        if (!response.ok) throw response;
        return response.json();
    },

    getUsers: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetchApi(`${API_ROUTES.ADMIN.USERS}${query ? `?${query}` : ''}`);
        if (!response.ok) throw response;
        return response.json();
    },

    getUserDetails: async (id) => {
        const response = await fetchApi(API_ROUTES.ADMIN.USER_DETAILS(id));
        if (!response.ok) throw response;
        return response.json();
    },

    getUserWallet: async (id) => {
        const response = await fetchApi(API_ROUTES.ADMIN.USER_WALLET(id));
        if (!response.ok) throw response;
        return response.json();
    },

    updateUserStatus: async (id, isActive) => {
        const response = await fetchApi(API_ROUTES.ADMIN.USER_STATUS(id), {
            method: 'PATCH',
            body: JSON.stringify({ isActive })
        });
        if (!response.ok) throw response;
        return response.json();
    },

    adjustWallet: async (id, data) => {
        const response = await fetchApi(API_ROUTES.ADMIN.USER_WALLET(id), {
            method: 'PATCH',
            body: JSON.stringify(data) // {amount, type, reason}
        });
        if (!response.ok) throw response;
        return response.json();
    },

    getWalletSummary: async (date) => {
        const query = date ? `?date=${date}` : '';
        const response = await fetchApi(`${API_ROUTES.ADMIN.WALLET_SUMMARY}${query}`);
        if (!response.ok) throw response;
        return response.json();
    },

    getWalletRangeSummary: async (params = {}) => { // {start, end, page, limit}
        const query = new URLSearchParams(params).toString();
        const response = await fetchApi(`${API_ROUTES.ADMIN.WALLET_RANGE}${query ? `?${query}` : ''}`);
        if (!response.ok) throw response;
        return response.json();
    }
};
