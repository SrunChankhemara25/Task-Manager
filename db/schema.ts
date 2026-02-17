// db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ✅ FIXED: Use underscore instead of space
export const taskStatusEnum = pgEnum("task_status", ["pending", "in_progress", "done"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const userRoleEnum = pgEnum("user_role", ["Admin", "User"]);
export const userStatusEnum = pgEnum("user_status", ["Active", "Blocked"]);

// Users Table
export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("User"),
  status: userStatusEnum("status").default("Active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Categories Table ✅ Correct for CRUD
export const categories = pgTable("categories", {
  categoryId: uuid("category_id").primaryKey().defaultRandom(),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  userId: uuid("user_id").references(() => users.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Tasks Table ✅ Correct with category reference
export const tasks = pgTable("tasks", {
  taskId: uuid("task_id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: taskStatusEnum("status").default("pending"),
  priority: priorityEnum("priority").default("medium"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .references(() => categories.categoryId, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Notifications Table ✅ Correct
export const notifications = pgTable("notifications", {
  notificationId: uuid("notification_id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  sendDate: timestamp("send_date", { withTimezone: true }).defaultNow(),
  status: varchar("status", { length: 50 }).default("unread"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  taskId: uuid("task_id").references(() => tasks.taskId, { onDelete: "cascade" }),
});

// Export Types
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type User = typeof users.$inferSelect;