"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  User as UserIcon,
} from "lucide-react";

import { useTasks } from "@/lib/task-context";
import type { User } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsersPage() {
  const { getAllUsers, getAllTasks, updateUserStatus, deleteUser } = useTasks();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const users = getAllUsers();
  const tasks = getAllTasks();

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  const taskCount = (userId: string) =>
    tasks.filter((t) => t.user_id === userId).length;

  const toggleStatus = (user: User) => {
    updateUserStatus(
      user.id,
      user.status === "active" ? "blocked" : "active"
    );
    window.location.reload();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteUser(deleteId);
    setDeleteId(null);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground">
          View and manage all registered users
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<UserIcon className="h-6 w-6 text-primary" />}
          value={users.length}
          label="Total Users"
          bg="bg-primary/10"
        />
        <StatCard
          icon={<UserCheck className="h-6 w-6 text-success" />}
          value={users.filter((u) => u.status === "active").length}
          label="Active Users"
          bg="bg-success/10"
        />
        <StatCard
          icon={<UserX className="h-6 w-6 text-destructive" />}
          value={users.filter((u) => u.status === "blocked").length}
          label="Blocked Users"
          bg="bg-destructive/10"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {user.full_name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                      >
                        {user.role === "admin" ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : (
                          <UserIcon className="h-3 w-3 mr-1" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          user.status === "active"
                            ? "border-success text-success"
                            : ""
                        }
                      >
                        {user.status === "active" ? (
                          <UserCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell>{taskCount(user.id)}</TableCell>

                    <TableCell>
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </TableCell>

                    <TableCell className="text-right">
                      {user.role !== "admin" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleStatus(user)}>
                              {user.status === "active" ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Block User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unblock User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(user.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <UserIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* Small helper component (UI unchanged) */
function StatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4 items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
