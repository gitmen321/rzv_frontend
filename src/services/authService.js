import { fetchApi } from './api';
import { API_ROUTES } from '../constants/apiRoutes';

export const authService = {
    login: async (email, password) => {
        const response = await fetchApi(API_ROUTES.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            throw response;
        }
        
        return response.json();
    },
    
    forgotPassword: async (email) => {
        const response = await fetchApi(API_ROUTES.AUTH.FORGOT_PASSWORD, {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        
        if (!response.ok) {
            throw response;
        }
        
        return response.json();
    },
    
    resetPassword: async (token, newPassword, confirmPassword) => {
        const response = await fetchApi(API_ROUTES.AUTH.RESET_PASSWORD(token), {
            method: 'POST',
            body: JSON.stringify({ newPassword, confirmPassword }),
        });
        
        if (!response.ok) {
            throw response;
        }
        
        return response.json();
    },
    
    logout: async () => {
        const response = await fetchApi(API_ROUTES.AUTH.LOGOUT, {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw response;
        }
        
        return response.json();
    },

    register: async ({ name, email, password, confirmPassword, referralCode }) => {
        const body = { name, email, password, confirmPassword };
        if (referralCode) body.referralCode = referralCode;
        const response = await fetchApi(API_ROUTES.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (!response.ok) throw response;
        return response.json();
    }
};
