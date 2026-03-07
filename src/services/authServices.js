import { API_ROUTES } from "../constants/apiRoutes";

export async function login(email, password) {
    const response = await fetch(`${API_ROUTES.API_BASE}${API_ROUTES.LOGIN}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            password
        })
    });

    return response.json();
}