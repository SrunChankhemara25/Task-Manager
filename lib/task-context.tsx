"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Task, Category, Notification, User } from "./types";
import { useAuth } from "./auth-context";

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  notifications: Notification[];
  users: User[];
  addTask: (
    task: Omit<Task, "id" | "created_at" | "user_id">
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Admin functions
  getAllTasks: () => Task[];
  getAllUsers: () => User[];
  updateUserStatus: (userId: string, status: "active" | "blocked") => void;
  deleteUser: (userId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample demo data
const DEMO_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Work", user_id: "user-1" },
  { id: "cat-2", name: "Personal", user_id: "user-1" },
  { id: "cat-3", name: "Shopping", user_id: "user-1" },
];

const DEMO_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Complete project proposal",
    description: "Finish the Q1 project proposal document",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "doing",
    priority: "high",
    user_id: "user-1",
    category_id: "cat-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Review team submissions",
    description: "Review and provide feedback on team submissions",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    priority: "medium",
    user_id: "user-1",
    category_id: "cat-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Buy groceries",
    description: "Get vegetables, fruits, and dairy products",
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    priority: "low",
    user_id: "user-1",
    category_id: "cat-3",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Exercise routine",
    description: "30 minutes of cardio and stretching",
    due_date: new Date().toISOString(),
    status: "done",
    priority: "medium",
    user_id: "user-1",
    category_id: "cat-2",
    created_at: new Date().toISOString(),
  },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    message: "Task 'Complete project proposal' is due in 2 days",
    send_date: new Date().toISOString(),
    status: "unread",
    user_id: "user-1",
    task_id: "task-1",
  },
  {
    id: "notif-2",
    message: "Welcome to Task Manager! Start by creating your first task.",
    send_date: new Date().toISOString(),
    status: "unread",
    user_id: "user-1",
    task_id: null,
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("task_manager_tasks");
    const storedCategories = localStorage.getItem("task_manager_categories");
    const storedNotifications = localStorage.getItem("task_manager_notifications");
    const storedUsers = localStorage.getItem("task_manager_users");

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(DEMO_TASKS);
      localStorage.setItem("task_manager_tasks", JSON.stringify(DEMO_TASKS));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(DEMO_CATEGORIES);
      localStorage.setItem(
        "task_manager_categories",
        JSON.stringify(DEMO_CATEGORIES)
      );
    }

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(DEMO_NOTIFICATIONS);
      localStorage.setItem(
        "task_manager_notifications",
        JSON.stringify(DEMO_NOTIFICATIONS)
      );
    }

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Filter tasks and categories for current user
  const userTasks = user
    ? tasks.filter((t) => t.user_id === user.id)
    : [];
  const userCategories = user
    ? categories.filter((c) => c.user_id === user.id)
    : [];
  const userNotifications = user
    ? notifications.filter((n) => n.user_id === user.id)
    : [];

  const addTask = (taskData: Omit<Task, "id" | "created_at" | "user_id">) => {
    if (!user) return;

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("task_manager_tasks", JSON.stringify(updatedTasks));

    // Add notification for new task
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message: `New task "${newTask.title}" has been created`,
      send_date: new Date().toISOString(),
      status: "unread",
      user_id: user.id,
      task_id: newTask.id,
    };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "task_manager_notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem("task_manager_tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("task_manager_tasks", JSON.stringify(updatedTasks));
  };

  const addCategory = (name: string) => {
    if (!user) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      user_id: user.id,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem(
      "task_manager_categories",
      JSON.stringify(updatedCategories)
    );
  };

  const updateCategory = (id: string, name: string) => {
    const updatedCategories = categories.map((c) =>
      c.id === id ? { ...c, name } : c
    );
    setCategories(updatedCategories);
    localStorage.setItem(
      "task_manager_categories",
      JSON.stringify(updatedCategories)
    );
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter((c) => c.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem(
      "task_manager_categories",
      JSON.stringify(updatedCategories)
    );

    // Remove category from tasks
    const updatedTasks = tasks.map((t) =>
      t.category_id === id ? { ...t, category_id: null } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem("task_manager_tasks", JSON.stringify(updatedTasks));
  };

  const markNotificationRead = (id: string) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, status: "read" as const } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "task_manager_notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    const updatedNotifications = notifications.map((n) =>
      n.user_id === user.id ? { ...n, status: "read" as const } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "task_manager_notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  // Admin functions
  const getAllTasks = () => tasks;
  const getAllUsers = () => {
    const storedUsers = localStorage.getItem("task_manager_users");
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    return [
      {
        id: "user-1",
        full_name: "Khemara",
        email: "khemra@gmail.com",
        password: "khemara123",
        role: "user" as const,
        status: "active" as const,
        created_at: new Date().toISOString(),
      },
      ...registeredUsers,
    ];
  };

  const updateUserStatus = (
    userId: string,
    status: "active" | "blocked"
  ) => {
    const storedUsers = localStorage.getItem("task_manager_users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const updatedUsers = parsedUsers.map((u: User) =>
        u.id === userId ? { ...u, status } : u
      );
      localStorage.setItem(
        "task_manager_users",
        JSON.stringify(updatedUsers)
      );
      setUsers(updatedUsers);
    }
  };

  const deleteUser = (userId: string) => {
    const storedUsers = localStorage.getItem("task_manager_users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const updatedUsers = parsedUsers.filter(
        (u: User) => u.id !== userId
      );
      localStorage.setItem(
        "task_manager_users",
        JSON.stringify(updatedUsers)
      );
      setUsers(updatedUsers);
    }

    // Also delete user's tasks
    const updatedTasks = tasks.filter((t) => t.user_id !== userId);
    setTasks(updatedTasks);
    localStorage.setItem("task_manager_tasks", JSON.stringify(updatedTasks));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: userTasks,
        categories: userCategories,
        notifications: userNotifications,
        users,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        updateCategory,
        deleteCategory,
        markNotificationRead,
        markAllNotificationsRead,
        getAllTasks,
        getAllUsers,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
