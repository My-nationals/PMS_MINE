import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { redirectBasedOnRole } from "@/utils/auth";
import api from "@/lib/api";
import { setCookie } from "@/utils/cookie";

// Define response structure
type AuthResponse = {
    status: number;
    success: boolean;
    message: string;
    data: {
        user: {
            id: string;
            names: string;
            email: string;
            telephone: string;
            role: string;
            profilePicture: string;
            verificationStatus: string;
            createdAt: string;
            updatedAt: string;
            // Add more fields as needed
        };
        token: string;
    };
};

export const useAuth = () => {
    const navigate = useNavigate();

    const loginMutation = useMutation<
        AuthResponse,
        any,
        { email: string; password: string }
    >({
        mutationFn: async (data) => {
            const response = await api.post("/auth/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Login successful!");
            setCookie("auth_token", data.data.token, 3);
            redirectBasedOnRole(navigate);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Login failed");
        },
    });

    const registerMutation = useMutation<
        AuthResponse,
        any,
        { names: string; email: string; telephone: string; password: string }
    >({
        mutationFn: async (data) => {
            const response = await api.post("/user/create", data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Registered successfully! Logging in...");
            setCookie("auth_token", data.data.token, 3);
            redirectBasedOnRole(navigate);
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Registration failed"
            );
        },
    });

    return {
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        loginLoading: loginMutation.isPending,
        registerLoading: registerMutation.isPending,
    };
};
