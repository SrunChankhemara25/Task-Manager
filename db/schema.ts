import { pgTable, text, timestamp, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const userStatusEnum = pgEnum("user_status", ["active", "blocked"]);
export const verificationTypeEnum = pgEnum("verification_type", ["signup", "signin", "forgot_password"]);

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  full_name: text("full_name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("user"),
  status: userStatusEnum("status").default("active"),
  email_verified: boolean("email_verified").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Verification Codes table (for signup, signin, password reset verification)
export const verificationCodes = pgTable("verification_codes", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  type: verificationTypeEnum("type").notNull(), // signup, signin, forgot_password
  is_used: boolean("is_used").default(false),
  expires_at: timestamp("expires_at").notNull(), // 10 minutes from creation
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Password Reset Tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  is_used: boolean("is_used").default(false),
  expires_at: timestamp("expires_at").notNull(), // 1 hour from creation
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  passwordResetTokens: many(passwordResetTokens),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.user_id], references: [users.id] }),
}));
