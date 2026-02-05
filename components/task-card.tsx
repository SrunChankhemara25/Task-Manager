"use client";

import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
} from "lucide-react";
import type { Task, Category, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  category?: Category;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const priorityConfig = {
  low: {
    color: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    dot: "bg-chart-2",
    label: "Low",
  },
  medium: {
    color: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    dot: "bg-chart-3",
    label: "Medium",
  },
  high: {
    color: "bg-destructive/20 text-destructive border-destructive/30",
    dot: "bg-destructive",
    label: "High",
  },
};

const statusConfig = {
  pending: {
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted hover:bg-muted/80",
    label: "Pending",
  },
  doing: {
    icon: Clock,
    color: "text-chart-3",
    bgColor: "bg-chart-3/20 hover:bg-chart-3/30",
    label: "In Progress",
  },
  done: {
    icon: CheckCircle2,
    color: "text-primary",
    bgColor: "bg-primary/20 hover:bg-primary/30",
    label: "Completed",
  },
};

export function TaskCard({
  task,
  category,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dueDate = new Date(task.due_date);
  const isOverdue = isPast(dueDate) && task.status !== "done";
  const isDueToday = isToday(dueDate);

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <div
      className={cn(
        "group relative p-5 rounded-2xl bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        task.status === "done" && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority indicator */}
      <div
        className={cn(
          "absolute left-0 top-6 bottom-6 w-1 rounded-full",
          priorityConfig[task.priority].dot
        )}
      />

      <div className="flex items-start gap-4 pl-3">
        {/* Status button */}
        <button
          onClick={() => {
            const nextStatus: TaskStatus =
              task.status === "pending"
                ? "doing"
                : task.status === "doing"
                  ? "done"
                  : "pending";
            onStatusChange(task.id, nextStatus);
          }}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 shrink-0 mt-0.5",
            statusConfig[task.status].bgColor
          )}
        >
          <StatusIcon
            className={cn("h-4 w-4", statusConfig[task.status].color)}
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-semibold text-card-foreground text-base",
                  task.status === "done" &&
                    "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 shrink-0 transition-opacity rounded-xl",
                    isHovered
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "pending")}
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "doing")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "done")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Complete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                priorityConfig[task.priority].color
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  priorityConfig[task.priority].dot
                )}
              />
              {priorityConfig[task.priority].label}
            </span>

            {category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground">
                {category.name}
              </span>
            )}

            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
                isOverdue
                  ? "bg-destructive/20 text-destructive"
                  : isDueToday
                    ? "bg-chart-3/20 text-chart-3"
                    : "bg-secondary text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              {isOverdue
                ? "Overdue"
                : isDueToday
                  ? "Due today"
                  : format(dueDate, "MMM d")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
