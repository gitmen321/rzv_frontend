import { API_ROUTES } from "../constants/apiRoutes";

export async function getDashboardStats() {

    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_ROUTES.API_BASE}${API_ROUTES.ADMIN_STATS}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        credentials: "include"
    });
    return response.json();
    
}