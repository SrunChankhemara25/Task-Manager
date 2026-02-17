// lib/task-context.tsx
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
import { useToast } from "./toast-context";

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  notifications: Notification[];
  users: User[];
  isLoading: boolean;
  addTask: (task: Omit<Task, "id" | "created_at" | "user_id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  refreshTasks: () => void;
  refreshCategories: () => void;
  refreshNotifications: () => void;
  getAllTasks: () => Task[];
  getAllUsers: () => User[];
  updateUserStatus: (userId: string, status: "active" | "blocked") => void;
  deleteUser: (userId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Helper: Safe JSON parse
const safeJsonParse = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  return null;
};

// Helper: Format task
const formatTask = (task: any): Task => ({
  id: task.id || task.taskId,
  title: task.title,
  description: task.description || "",
  due_date: task.due_date || task.dueDate || new Date().toISOString(),
  status: task.status || "pending",
  priority: task.priority || "medium",
  user_id: task.user_id || task.userId,
  category_id: task.category_id || task.categoryId,
  created_at: task.created_at || task.createdAt,
});

// Helper: Format category
const formatCategory = (cat: any): Category => ({
  id: cat.id || cat.categoryId,
  name: cat.name || cat.categoryName,
  user_id: cat.user_id || cat.userId,
});

// Helper: Format notification
const formatNotification = (notif: any): Notification => ({
  id: notif.id || notif.notificationId,
  message: notif.message,
  send_date: notif.send_date || notif.sendDate || new Date().toISOString(),
  status: notif.status || "unread",
  user_id: notif.user_id || notif.userId,
  task_id: notif.task_id || notif.taskId,
});

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Tasks
  const fetchTasks = async () => {
    if (!user?.id) {
      setTasks([]);
      return;
    }
    try {
      const res = await fetch(`/api/tasks?userId=${user.id}`);
      if (res.ok) {
        const data = await safeJsonParse(res);
        if (data) {
          setTasks(data.map(formatTask));
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await safeJsonParse(res);
        if (data) {
          setCategories(data.map(formatCategory));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await safeJsonParse(res);
        if (data) {
          setNotifications(data.map(formatNotification));
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  // Load data on user login
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTasks(), fetchCategories(), fetchNotifications()]);
      setIsLoading(false);
    };

    if (user) {
      loadData();
    } else {
      setTasks([]);
      setCategories([]);
      setNotifications([]);
      setIsLoading(false);
    }
  }, [user]);

  // ADD Task
  const addTask = async (taskData: Omit<Task, "id" | "created_at" | "user_id">) => {
    if (!user) {
      showToast("Please log in to create tasks", "error");
      return;
    }
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskData, user_id: user.id }),
      });

      if (res.ok) {
        const newTask = await safeJsonParse(res);
        if (newTask) {
          setTasks((prev) => [...prev, formatTask(newTask)]);
          await fetchNotifications();
          showToast(`Task "${newTask.title}" created successfully!`, "success");
        }
      } else {
        const error = await safeJsonParse(res);
        showToast(error?.error || "Failed to create task", "error");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  // UPDATE Task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updatedTask = await safeJsonParse(res);
        if (updatedTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === id ? formatTask(updatedTask) : t))
          );
          showToast("Task updated successfully!", "success");
        }
      } else {
        const error = await safeJsonParse(res);
        showToast(error?.error || "Failed to update task", "error");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  // DELETE Task
  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast("Task deleted successfully!", "success");
      } else {
        const error = await safeJsonParse(res);
        showToast(error?.error || "Failed to delete task", "error");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  // ADD Category
  const addCategory = async (name: string) => {
    if (!user) {
      showToast("Please log in to create categories", "error");
      return;
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: name, user_id: user.id }),
      });

      if (res.ok) {
        const newCat = await safeJsonParse(res);
        if (newCat) {
          setCategories((prev) => [...prev, formatCategory(newCat)]);
          showToast(`Category "${name}" created successfully!`, "success");
        }
      } else {
        const error = await safeJsonParse(res);
        showToast(error?.error || "Failed to create category", "error");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  // UPDATE Category
  const updateCategory = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: name }),
      });

      if (res.ok) {
        const updatedCat = await safeJsonParse(res);
        if (updatedCat) {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? formatCategory(updatedCat) : c))
          );
          showToast(`Category updated to "${name}"!`, "success");
        }
      } else {
        const error = await safeJsonParse(res);
        showToast(error?.error || "Failed to update category", "error");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  // DELETE Category
  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setTasks((prev) =>
          prev.map((t) => (t.category_id === id ? { ...t, category_id: null } : t))
        );
        showToast("Category deleted successfully!", "success");
      } else {
        const error = await safeJsonParse(res);
        showToast(error?.error || "Failed to delete category", "error");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  // Mark Notification Read
  const markNotificationRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  // Mark All Notifications Read
  const markAllNotificationsRead = async () => {
    if (!user) return;
    try {
      const unreadIds = notifications
        .filter((n) => n.user_id === user.id && n.status === "unread")
        .map((n) => n.id);

      await Promise.all(unreadIds.map((id) => markNotificationRead(id)));
    } catch (error) {
      console.error("Error marking all notifications:", error);
    }
  };

  // Refresh Functions
  const refreshTasks = fetchTasks;
  const refreshCategories = fetchCategories;
  const refreshNotifications = fetchNotifications;

  // Admin Functions
  const getAllTasks = () => tasks;
  const getAllUsers = () => users;

  const updateUserStatus = async (userId: string, status: "active" | "blocked") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status } : u))
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setTasks((prev) => prev.filter((t) => t.user_id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        notifications,
        users,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        updateCategory,
        deleteCategory,
        markNotificationRead,
        markAllNotificationsRead,
        refreshTasks,
        refreshCategories,
        refreshNotifications,
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