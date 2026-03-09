import { fetchApi } from './api';
import { API_ROUTES } from '../constants/apiRoutes';

export const auditService = {
    getLogs: async (params = {}) => { // {page, limit, action, adminId, targetedUserId}
        const query = new URLSearchParams(params).toString();
        const response = await fetchApi(`${API_ROUTES.AUDIT.LOGS}${query ? `?${query}` : ''}`);
        if (!response.ok) throw response;
        return response.json();
    },

    getRecentActivity: async () => {
        const response = await fetchApi(API_ROUTES.AUDIT.RECENT);
        if (!response.ok) throw response;
        return response.json();
    }
};
