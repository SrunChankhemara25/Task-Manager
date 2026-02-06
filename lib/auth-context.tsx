"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "./types";

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
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get all users including registered ones
    const storedUsers = localStorage.getItem("task_manager_users");
    const allUsers = storedUsers
      ? [...DEMO_USERS, ...JSON.parse(storedUsers)]
      : DEMO_USERS;

    const foundUser = allUsers.find(
      (u: User) => u.email === email && u.password === password
    );

    if (foundUser) {
      if (foundUser.status === "blocked") {
        return false;
      }
      setUser(foundUser);
      localStorage.setItem("task_manager_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<boolean> => {
    const storedUsers = localStorage.getItem("task_manager_users");
    const existingUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if email already exists
    const allUsers = [...DEMO_USERS, ...existingUsers];
    if (allUsers.some((u) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      full_name: fullName,
      email,
      password,
      role: "user",
      status: "active",
      created_at: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem("task_manager_users", JSON.stringify(existingUsers));
    setUser(newUser);
    localStorage.setItem("task_manager_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("task_manager_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
