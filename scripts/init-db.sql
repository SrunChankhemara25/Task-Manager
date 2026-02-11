-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE user_status AS ENUM ('active', 'blocked');
CREATE TYPE task_status AS ENUM ('pending', 'doing', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE notification_status AS ENUM ('unread', 'read');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role user_role DEFAULT 'user',
  status user_status DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  status task_status DEFAULT 'pending',
  priority task_priority DEFAULT 'medium',
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  send_date TIMESTAMP NOT NULL DEFAULT NOW(),
  status notification_status DEFAULT 'unread',
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_task_id ON notifications(task_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Seed demo data
INSERT INTO users (id, full_name, email, password, role, status, created_at) 
VALUES 
  ('admin-1', 'Admin User', 'admin@gmail.com', '$2b$10$4pS2T7R9yK8mL5N2qJ6xO.9pS2T7R9yK8mL5N2qJ6xO.9pS2T7R9y', 'admin', 'active', NOW()),
  ('user-1', 'Khemara', 'khemara@gmail.com', '$2b$10$4pS2T7R9yK8mL5N2qJ6xO.9pS2T7R9yK8mL5N2qJ6xO.9pS2T7R9y', 'user', 'active', NOW())
ON CONFLICT DO NOTHING;

-- Seed demo categories
INSERT INTO categories (id, name, user_id, created_at)
VALUES
  ('cat-1', 'Work', 'user-1', NOW()),
  ('cat-2', 'Personal', 'user-1', NOW()),
  ('cat-3', 'Shopping', 'user-1', NOW())
ON CONFLICT DO NOTHING;

-- Seed demo tasks
INSERT INTO tasks (id, title, description, due_date, status, priority, user_id, category_id, created_at)
VALUES
  ('task-1', 'Complete project proposal', 'Finish the Q1 project proposal document', NOW() + INTERVAL '2 days', 'doing', 'high', 'user-1', 'cat-1', NOW()),
  ('task-2', 'Review team submissions', 'Review and provide feedback on team submissions', NOW() + INTERVAL '5 days', 'pending', 'medium', 'user-1', 'cat-1', NOW()),
  ('task-3', 'Buy groceries', 'Get vegetables, fruits, and dairy products', NOW() + INTERVAL '1 day', 'pending', 'low', 'user-1', 'cat-3', NOW()),
  ('task-4', 'Exercise routine', '30 minutes of cardio and stretching', NOW(), 'done', 'medium', 'user-1', 'cat-2', NOW())
ON CONFLICT DO NOTHING;

-- Seed demo notifications
INSERT INTO notifications (id, message, send_date, status, user_id, task_id, created_at)
VALUES
  ('notif-1', 'Task ''Complete project proposal'' is due in 2 days', NOW(), 'unread', 'user-1', 'task-1', NOW()),
  ('notif-2', 'Welcome to Task Manager! Start by creating your first task.', NOW(), 'unread', 'user-1', NULL, NOW())
ON CONFLICT DO NOTHING;
