/**
 * Check if running on the client side
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Gets a cookie value by name on the client side
 * @param {string} name 
 * @returns {string|null}
 */
export const getCookie = (name) => {
    if (!isBrowser) return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

/**
 * Deletes a client-side cookie
 * @param {string} name 
 */
export const deleteCookie = (name) => {
    if (!isBrowser) return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
