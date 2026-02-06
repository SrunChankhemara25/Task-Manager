"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update user in localStorage
    if (user) {
      const updatedUser = { ...user, full_name: fullName, email };
      localStorage.setItem("task_manager_user", JSON.stringify(updatedUser));

      // Also update in users list if exists
      const storedUsers = localStorage.getItem("task_manager_users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: typeof user) =>
          u.id === user.id ? updatedUser : u
        );
        localStorage.setItem("task_manager_users", JSON.stringify(updatedUsers));
      }
    }

    setMessage({ type: "success", text: "Profile updated successfully!" });
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    if (user && currentPassword !== user.password) {
      setMessage({ type: "error", text: "Current password is incorrect" });
      return;
    }

    setIsSaving(true);

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update password in localStorage
    if (user) {
      const updatedUser = { ...user, password: newPassword };
      localStorage.setItem("task_manager_user", JSON.stringify(updatedUser));

      const storedUsers = localStorage.getItem("task_manager_users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: typeof user) =>
          u.id === user.id ? updatedUser : u
        );
        localStorage.setItem("task_manager_users", JSON.stringify(updatedUsers));
      }
    }

    setMessage({ type: "success", text: "Password changed successfully!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    // Remove user from storage
    const storedUsers = localStorage.getItem("task_manager_users");
    if (storedUsers && user) {
      const users = JSON.parse(storedUsers);
      const filteredUsers = users.filter(
        (u: typeof user) => u.id !== user.id
      );
      localStorage.setItem(
        "task_manager_users",
        JSON.stringify(filteredUsers)
      );
    }

    // Remove user's tasks and categories
    const storedTasks = localStorage.getItem("task_manager_tasks");
    if (storedTasks && user) {
      const tasks = JSON.parse(storedTasks);
      const filteredTasks = tasks.filter(
        (t: { user_id: string }) => t.user_id !== user.id
      );
      localStorage.setItem("task_manager_tasks", JSON.stringify(filteredTasks));
    }

    const storedCategories = localStorage.getItem("task_manager_categories");
    if (storedCategories && user) {
      const categories = JSON.parse(storedCategories);
      const filteredCategories = categories.filter(
        (c: { user_id: string }) => c.user_id !== user.id
      );
      localStorage.setItem(
        "task_manager_categories",
        JSON.stringify(filteredCategories)
      );
    }

    logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        {/* User Info Card */}
            <div className="pl-4 border-b border-border pb-8 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-13 h-13 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-lg">
                  {user?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-medium text-sidebar-foreground truncate">
                    {user?.full_name}
                  </p>
                  <p className="text-l text-sidebar-foreground/60 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isSaving || !currentPassword || !newPassword}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data including tasks and categories.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
