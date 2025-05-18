import Cookies from "js-cookie";
import type { NavigateFunction } from "react-router-dom";
export const setCookie = (name: string, value: string, hours: number) => {
    Cookies.set(name, value, { expires: hours / 24, path: "/" });
};
export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};
export const deleteCookie = (name: string) => {
    Cookies.remove(name, { path: "/" });
};
export const logout = (navigate: NavigateFunction) => {
    deleteCookie("auth_token");
    navigate("/login");
};
