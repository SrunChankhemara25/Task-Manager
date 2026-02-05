"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useTasks } from "@/lib/task-context";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const priorityConfig = {
  low: { color: "bg-chart-2/15 text-chart-2", label: "Low" },
  medium: { color: "bg-warning/15 text-warning-foreground", label: "Medium" },
  high: { color: "bg-destructive/15 text-destructive", label: "High" },
};

const statusConfig = {
  pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
  doing: { icon: AlertCircle, color: "text-primary", label: "In Progress" },
  done: { icon: CheckCircle2, color: "text-success", label: "Completed" },
};

export default function AdminTasksPage() {
  const { getAllTasks, getAllUsers } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const allTasks = getAllTasks();
  const allUsers = getAllUsers();

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [allTasks, searchQuery, statusFilter, priorityFilter]);

  // Stats
  const totalTasks = allTasks.length;
  const pendingTasks = allTasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "doing").length;
  const completedTasks = allTasks.filter((t) => t.status === "done").length;

  const getUserName = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    return user?.full_name || "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Tasks</h1>
        <p className="text-muted-foreground">
          View and manage tasks from all users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalTasks}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">{pendingTasks}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold">{inProgressTasks}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold">{completedTasks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Tasks ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const StatusIcon = statusConfig[task.status].icon;
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {getUserName(task.user_id).charAt(0)}
                          </div>
                          <span className="text-sm">
                            {getUserName(task.user_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            className={cn(
                              "h-4 w-4",
                              statusConfig[task.status].color
                            )}
                          />
                          <span className="text-sm">
                            {statusConfig[task.status].label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={priorityConfig[task.priority].color}
                        >
                          {priorityConfig[task.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(task.due_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(task.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <CheckSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No tasks found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
