import { jwtDecode } from "jwt-decode";
import { getCookie } from "./cookie";
import type { NavigateFunction } from "react-router-dom";
type TokenPayload = {
    role: string;
    [key: string]: unknown; // instead of 'any'
};
/**
 * Utility function to validate JWT token format
 */
const isValidToken = (token: string | undefined): token is string => {
    return !!token && token.split(".").length === 3;
};
/**
 * Extracts the role from JWT token
 */
export const getUserRole = (): string | null => {
    const token = getCookie("auth_token");
    if (!isValidToken(token)) return null;
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.role || null;
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
};
/**
 * Redirect user based on role extracted from JWT token
 */
export const redirectBasedOnRole = (navigate: NavigateFunction) => {
    const token = getCookie("auth_token");
    if (!isValidToken(token)) {
        console.warn("No valid token found");
        navigate("/login");
        return;
    }
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        switch (decoded.role?.toLowerCase()) {
            case "admin":
                navigate("/admin");
                break;
            case "user":
                navigate("/user");
                break;
            default:
                navigate("/login");
        }
    } catch (err) {
        console.error("Token decode error:", err);
        navigate("/login");
    }
};
