export type UserRole = "admin" | "user";
export type UserStatus = "active" | "blocked";
export type TaskStatus = "pending" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type NotificationStatus = "unread" | "read";

export interface User {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  user_id: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  user_id: string;
  category_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  message: string;
  send_date: string;
  status: NotificationStatus;
  user_id: string;
  task_id: string | null;
}
