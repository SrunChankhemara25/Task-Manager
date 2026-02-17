// app/user/dashboard/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/task-context";
import type { Task, TaskStatus } from "@/lib/types";
import { StatsCard } from "@/components/stats-card";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, categories, addTask, updateTask, deleteTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Calculate stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  // Get recent tasks (not completed)
  const recentTasks = tasks
    .filter((t) => t.status !== "done")
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    )
    .slice(0, 5);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, "id" | "created_at" | "user_id">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const getCategoryForTask = (task: Task) => {
    return categories.find((c) => c.id === task.category_id);
  };

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, {user?.full_name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Button onClick={handleAddTask} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={CheckSquare}
          trend={`${completionRate}% complete`}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Pending"
          value={pendingTasks}
          icon={Clock}
          iconClassName="bg-muted text-muted-foreground"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks}
          icon={AlertCircle}
          iconClassName="bg-chart-3/10 text-chart-3"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          iconClassName="bg-primary/10 text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Tasks
            </h2>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href="/user/tasks">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task, index) => (
                <TaskCard
                  key={task.id || `task-${index}`}  // ✅ FIXED: Fallback key if id is missing
                  task={{
                    ...task,
                    id: task.id || `task-${index}`,  // ✅ Ensure task has valid id
                  }}
                  category={getCategoryForTask(task)}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="text-center py-16 rounded-2xl bg-card border border-border">
                <CheckCircle2 className="h-14 w-14 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-foreground font-medium">No upcoming tasks</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create one to get started!
                </p>
                <Button onClick={handleAddTask} className="mt-4 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Task Progress
          </h2>

          <div className="p-6 rounded-2xl bg-card border border-border">
            {totalTasks > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-border"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray={`${completionRate}, 100`}
                        strokeLinecap="round"
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-foreground">
                          {completionRate}%
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <span className="text-sm text-foreground">Pending</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {pendingTasks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-chart-3" />
                      <span className="text-sm text-foreground">In Progress</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {inProgressTasks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">Completed</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {completedTasks}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-foreground">No tasks yet</p>
                <p className="text-sm mt-1">Create tasks to track progress</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        categories={categories}
        onSave={handleSaveTask}
      />
      
    </div>
    
  );
}