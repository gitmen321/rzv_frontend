import { API_ROUTES } from '../constants/apiRoutes';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// In-memory token storage to avoid localStorage if possible, but fallback to localStorage
let inMemoryToken = null;

export const setAccessToken = (token) => {
    inMemoryToken = token;
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }
};

export const getAccessToken = () => {
    if (inMemoryToken) return inMemoryToken;
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const fetchApi = async (url, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const token = getAccessToken();
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include', // Important for sending/receiving refresh cycle cookies
    };

    try {
        const response = await fetch(`${BASE_URL}${url}`, config);

        // If not 401, return response directly
        if (response.status !== 401) {
            return response;
        }

        // If 401 and not refreshing, start refresh process
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refreshResponse = await fetch(`${BASE_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setAccessToken(data.accessToken);

                    // Update header and retry original request
                    config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    
                    processQueue(null, data.accessToken);
                    return await fetch(`${BASE_URL}${url}`, config);
                } else {
                    throw new Error('Refresh failed');
                }
            } catch (err) {
                processQueue(err, null);
                setAccessToken(null);
                // Redirect logic can be handled by auth guard, but we can emit event or reload
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                throw err;
            } finally {
                isRefreshing = false;
            }
        }

        // Return a promise that waits for the refresh to finish
        return new Promise((resolve, reject) => {
            failedQueue.push({
                resolve: (newToken) => {
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(fetch(`${BASE_URL}${url}`, config));
                },
                reject: (err) => {
                    reject(err);
                }
            });
        });

    } catch (error) {
        throw error;
    }
};
