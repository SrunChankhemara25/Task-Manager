"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTasks } from "@/lib/task-context";
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const { tasks, categories, addTask, updateTask, deleteTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || task.category_id === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Group tasks by status for Kanban-like view
  const tasksByStatus = useMemo(() => {
    return {
      pending: filteredTasks.filter((t) => t.status === "pending"),
      doing: filteredTasks.filter((t) => t.status === "doing"),
      done: filteredTasks.filter((t) => t.status === "done"),
    };
  }, [filteredTasks]);

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

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all";

  const activeFilterCount = [
    statusFilter !== "all",
    priorityFilter !== "all",
    categoryFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Tasks
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your tasks
          </p>
        </div>
        <Button onClick={handleAddTask} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary border-border rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-12 rounded-xl bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="doing">In Progress</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] h-12 rounded-xl bg-secondary border-border">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] h-12 rounded-xl bg-secondary border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex rounded-xl border border-border overflow-hidden bg-secondary">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-none h-12 w-12",
                  viewMode === "list" && "bg-primary text-primary-foreground"
                )}
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-none h-12 w-12",
                  viewMode === "grid" && "bg-primary text-primary-foreground"
                )}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeFilterCount > 0 && (
              <span className="text-sm text-muted-foreground">
                +{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Task Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Tasks Display */}
      {viewMode === "list" ? (
        // List View
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks
              .sort(
                (a, b) =>
                  new Date(a.due_date).getTime() -
                  new Date(b.due_date).getTime()
              )
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={getCategoryForTask(task)}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
          ) : (
            <div className="text-center py-20 rounded-2xl bg-card border border-border">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-medium text-foreground">
                No tasks found
              </p>
              <p className="text-sm mt-1 text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
              {!hasActiveFilters && (
                <Button onClick={handleAddTask} className="mt-4 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Grid/Kanban View
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["pending", "doing", "done"] as const).map((status) => (
            <div key={status} className="space-y-4">
              <div
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl",
                  status === "pending" && "bg-secondary",
                  status === "doing" && "bg-chart-3/10",
                  status === "done" && "bg-primary/10"
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    status === "pending" && "bg-muted-foreground",
                    status === "doing" && "bg-chart-3",
                    status === "done" && "bg-primary"
                  )}
                />
                <h3 className="font-semibold text-foreground">
                  {status === "doing" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                </h3>
                <span className="ml-auto text-sm font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-lg">
                  {tasksByStatus[status].length}
                </span>
              </div>

              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategoryForTask(task)}
                    onEdit={handleEditTask}
                    onDelete={deleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}

                {tasksByStatus[status].length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed border-border rounded-2xl">
                    No {status === "doing" ? "in progress" : status} tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
