"use client";

import { format } from "date-fns";
import {
  Users,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/task-context";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { getAllTasks, getAllUsers } = useTasks();

  const tasks = getAllTasks();
  const users = getAllUsers();

  const totalTasks = tasks.length;
  const totalUsers = users.length;

  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const completedTasks = tasks.filter(t => t.status === "done").length;

  const highPriorityTasks = tasks.filter(t => t.priority === "high").length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === "medium").length;
  const lowPriorityTasks = tasks.filter(t => t.priority === "low").length;

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const percentage = (value: number) =>
    totalTasks ? (value / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.full_name}. Here is an overview of the system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={CheckSquare}
          iconClassName="bg-chart-2/10 text-chart-2"
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
          iconClassName="bg-muted text-muted-foreground"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          iconClassName="bg-success/10 text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Task Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* High */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">
                  High Priority
                </span>
                <span className="font-medium">
                  {highPriorityTasks}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive rounded-full transition-all"
                  style={{ width: `${percentage(highPriorityTasks)}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">
                  Medium Priority
                </span>
                <span className="font-medium">
                  {mediumPriorityTasks}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${percentage(mediumPriorityTasks)}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">
                  Low Priority
                </span>
                <span className="font-medium">
                  {lowPriorityTasks}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 rounded-full transition-all"
                  style={{ width: `${percentage(lowPriorityTasks)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length ? (
              <div className="space-y-4">
                {recentTasks.map(task => {
                  const taskUser = users.find(
                    u => u.id === task.user_id
                  );

                  return (
                    <div
                      key={task.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          by {taskUser?.full_name || "Unknown"} ·{" "}
                          {format(
                            new Date(task.created_at),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>

                      <Badge
                        variant={
                          task.status === "done"
                            ? "default"
                            : task.status === "doing"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {task.status === "doing"
                          ? "In Progress"
                          : task.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
