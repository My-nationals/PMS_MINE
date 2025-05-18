import { getCookie } from "@/utils/cookie";
import { createContext, useContext } from "react";
const AuthContext = createContext({ isAuthenticated: false });
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const token = getCookie("auth_token");
    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);
