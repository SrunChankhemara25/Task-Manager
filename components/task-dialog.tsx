"use client";

import React from "react";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { Task, Category, TaskStatus, TaskPriority } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  categories: Category[];
  onSave: (taskData: Omit<Task, "id" | "created_at" | "user_id">) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  categories,
  onSave,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [categoryId, setCategoryId] = useState<string>("no-category");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(format(new Date(task.due_date), "yyyy-MM-dd"));
      setStatus(task.status);
      setPriority(task.priority);
      setCategoryId(task.category_id || "no-category");
    } else {
      setTitle("");
      setDescription("");
      setDueDate(format(new Date(), "yyyy-MM-dd"));
      setStatus("pending");
      setPriority("medium");
      setCategoryId("no-category");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      due_date: new Date(dueDate).toISOString(),
      status,
      priority,
      category_id: categoryId === "no-category" ? null : categoryId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold">
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="h-12 bg-secondary border-border rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="min-h-[100px] bg-secondary border-border rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due-date" className="text-foreground">
                Due Date
              </Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Category
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-12 bg-secondary border-border rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-category">No Category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Priority</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "h-12 rounded-xl border-2 font-medium text-sm capitalize transition-all duration-200",
                    priority === p
                      ? p === "low"
                        ? "border-chart-2 bg-chart-2/20 text-chart-2"
                        : p === "medium"
                          ? "border-chart-3 bg-chart-3/20 text-chart-3"
                          : "border-destructive bg-destructive/20 text-destructive"
                      : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Status</Label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { value: "pending", label: "Pending" },
                  { value: "doing", label: "In Progress" },
                  { value: "done", label: "Completed" },
                ] as const
              ).map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "h-12 rounded-xl border-2 font-medium text-sm transition-all duration-200",
                    status === s.value
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-12 px-6 rounded-xl">
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
