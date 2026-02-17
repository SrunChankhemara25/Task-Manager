// lib/api-client.ts
const API_BASE = "/api/auth";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  created_at?: string;
}

export interface ApiResponse<T> {
  user?: T;
  message?: string;
  error?: string;
  code?: string;
  resetToken?: string;
  success?: boolean;
}

export const apiClient = {
  // Login
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data.user!;
  },

  // Register
  async register(email: string, password: string, fullName: string): Promise<User> {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data.user!;
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<{ code: string }> {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send reset code");
    }

    return { code: data.code || "" };
  },

  // Verify Code
  async verifyCode(email: string, code: string): Promise<{ resetToken: string }> {
    const res = await fetch(`${API_BASE}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Invalid code");
    }

    return { resetToken: data.resetToken || "" };
  },

  // Reset Password
  async resetPassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to reset password");
    }

    return { success: true };
  },

  // Verify Signup Code
  async verifySignupCode(email: string, code: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/verify-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Invalid verification code");
    }

    return true;
  },

  // Resend Verification Code
  async resendVerificationCode(
    email: string,
    type: "signup" | "signin" | "forgot_password"
  ): Promise<{ code: string }> {
    const res = await fetch(`${API_BASE}/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to resend code");
    }

    return { code: data.code || "" };
  },
};