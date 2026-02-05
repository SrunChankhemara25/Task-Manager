"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Bell, Send, Users, CheckCircle2 } from "lucide-react";
import { useTasks } from "@/lib/task-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Notification } from "@/lib/types";

export default function AdminNotificationsPage() {
  const { getAllUsers } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sentNotifications, setSentNotifications] = useState<
    Array<{ message: string; date: string; recipients: number }>
  >([]);

  const allUsers = getAllUsers();

  const handleSendNotification = () => {
    if (!message.trim()) return;

    // In a real app, this would send to all users via the backend
    // For now, we'll just track it locally
    const newNotification = {
      message,
      date: new Date().toISOString(),
      recipients: allUsers.length,
    };

    // Add to each user's notifications in localStorage
    allUsers.forEach((user) => {
      const notification: Notification = {
        id: `notif-${Date.now()}-${user.id}`,
        message,
        send_date: new Date().toISOString(),
        status: "unread",
        user_id: user.id,
        task_id: null,
      };

      const storedNotifications = localStorage.getItem(
        "task_manager_notifications"
      );
      const notifications = storedNotifications
        ? JSON.parse(storedNotifications)
        : [];
      notifications.push(notification);
      localStorage.setItem(
        "task_manager_notifications",
        JSON.stringify(notifications)
      );
    });

    setSentNotifications([newNotification, ...sentNotifications]);
    setMessage("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Send notifications to all users
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allUsers.length}</p>
                <p className="text-sm text-muted-foreground">Total Recipients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success/10">
                <Bell className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sentNotifications.length}</p>
                <p className="text-sm text-muted-foreground">
                  Notifications Sent (this session)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recently Sent</CardTitle>
          <CardDescription>
            Notifications sent during this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sentNotifications.length > 0 ? (
            <div className="space-y-4">
              {sentNotifications.map((notif, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notif.message}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>
                        {format(new Date(notif.date), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      <span>Sent to {notif.recipients} users</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No notifications sent yet</p>
              <p className="text-sm mt-1">
                Send a notification to all users to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Notification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your notification message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>This will be sent to {allUsers.length} users</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} disabled={!message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send to All Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
