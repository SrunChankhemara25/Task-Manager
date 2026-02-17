// lib/types.ts
export type TaskStatus = "pending" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  user_id: string;
  category_id: string | null;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  user_id?: string;
}

export interface Notification {
  id: string;
  message: string;
  send_date: string;
  status: "read" | "unread";
  user_id: string;
  task_id: string | null;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  created_at?: string;
}