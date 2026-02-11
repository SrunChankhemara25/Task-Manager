"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { apiClient } from "./api-client";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  // Password reset methods
  forgotPassword: (email: string) => Promise<{ code: string; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ resetToken: string; error?: string }>;
  resetPassword: (resetToken: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  verifySignupCode: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string, type: 'signup' | 'signin' | 'forgot_password') => Promise<{ code: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: "admin-1",
    full_name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "user-1",
    full_name: "Khemara",
    email: "khemara@gmail.com",
    password: "khemara123",
    role: "user",
    status: "active",
    created_at: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("task_manager_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await apiClient.login(email, password);
      setUser(userData);
      localStorage.setItem("task_manager_user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<boolean> => {
    try {
      const userData = await apiClient.register(email, password, fullName);
      setUser(userData);
      localStorage.setItem("task_manager_user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("task_manager_user");
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiClient.forgotPassword(email);
      return { code: response.code || "" };
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      return { code: "", error: error.message || "Failed to process forgot password" };
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      const response = await apiClient.verifyCode(email, code);
      return { resetToken: response.resetToken || "" };
    } catch (error: any) {
      console.error("Code verification failed:", error);
      return { resetToken: "", error: error.message || "Invalid or expired code" };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string, confirmPassword: string) => {
    try {
      await apiClient.resetPassword(resetToken, newPassword, confirmPassword);
      return { success: true };
    } catch (error: any) {
      console.error("Password reset failed:", error);
      return { success: false, error: error.message || "Failed to reset password" };
    }
  };

  const verifySignupCode = async (email: string, code: string): Promise<boolean> => {
    try {
      const response = await apiClient.verifySignupCode(email, code);
      // After verification, optionally auto-login or just return success
      return true;
    } catch (error: any) {
      console.error("Signup verification failed:", error);
      return false;
    }
  };

  const resendVerificationCode = async (email: string, type: 'signup' | 'signin' | 'forgot_password') => {
    try {
      const response = await apiClient.resendVerificationCode(email, type);
      return { code: response.code || "" };
    } catch (error: any) {
      console.error("Resend code failed:", error);
      return { code: "", error: error.message || "Failed to resend code" };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isLoading,
        forgotPassword,
        verifyCode,
        resetPassword,
        verifySignupCode,
        resendVerificationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
