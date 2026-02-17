"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { useRouter } from "next/navigation";
import { useToast } from "./toast-context";

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
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  // Password reset methods
  forgotPassword: (email: string) => Promise<{ code: string; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ resetToken: string; error?: string }>;
  resetPassword: (resetToken: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  verifySignupCode: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string, type: 'signup' | 'signin' | 'forgot_password') => Promise<{ code: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("task_manager_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("task_manager_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("task_manager_user", JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.full_name}!`, "success");
        router.push("/user/dashboard");
        return true;
      } else {
        showToast(data.error || "Login failed", "error");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      showToast("Network error. Please try again.", "error");
      return false;
    }
  };

  // Register
  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("task_manager_user", JSON.stringify(data.user));
        showToast("Account created successfully!", "success");
        router.push("/user/dashboard");
        return true;
      } else {
        showToast(data.error || "Registration failed", "error");
        return false;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      showToast("Network error. Please try again.", "error");
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("task_manager_user");
    showToast("Logged out successfully", "info");
    router.push("/auth/login");
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) {
      showToast("Please log in to update profile", "error");
      return false;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem("task_manager_user", JSON.stringify(updatedUser));
        showToast("Profile updated successfully!", "success");
        return true;
      } else {
        const error = await res.json();
        showToast(error.error || "Failed to update profile", "error");
        return false;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Network error. Please try again.", "error");
      return false;
    }
  };

  // Forgot Password
  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        return { code: data.code || "" };
      } else {
        return { code: "", error: data.error || "Failed to send reset code" };
      }
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      return { code: "", error: "Network error" };
    }
  };

  // Verify Code
  const verifyCode = async (email: string, code: string) => {
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        return { resetToken: data.resetToken || "" };
      } else {
        return { resetToken: "", error: data.error || "Invalid code" };
      }
    } catch (error: any) {
      console.error("Code verification failed:", error);
      return { resetToken: "", error: "Network error" };
    }
  };

  // Reset Password
  const resetPassword = async (resetToken: string, newPassword: string, confirmPassword: string) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to reset password" };
      }
    } catch (error: any) {
      console.error("Password reset failed:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Verify Signup Code
  const verifySignupCode = async (email: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error("Signup verification failed:", error);
      return false;
    }
  };

  // Resend Verification Code
  const resendVerificationCode = async (email: string, type: 'signup' | 'signin' | 'forgot_password') => {
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      const data = await res.json();

      if (res.ok) {
        return { code: data.code || "" };
      } else {
        return { code: "", error: data.error || "Failed to resend code" };
      }
    } catch (error: any) {
      console.error("Resend code failed:", error);
      return { code: "", error: "Network error" };
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
        updateUser, 
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