"use client";

import { format } from "date-fns";
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { useTasks } from "@/lib/task-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useTasks();

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.send_date).getTime() - new Date(a.send_date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllNotificationsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {sortedNotifications.length > 0 ? (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors",
                notification.status === "unread" && "border-l-4 border-l-primary"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full",
                      notification.status === "unread"
                        ? "bg-primary/10"
                        : "bg-muted"
                    )}
                  >
                    <Bell
                      className={cn(
                        "h-5 w-5",
                        notification.status === "unread"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm",
                        notification.status === "unread"
                          ? "font-medium text-card-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(
                          new Date(notification.send_date),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                  </div>

                  {notification.status === "unread" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markNotificationRead(notification.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No notifications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {"You're all caught up! Check back later for updates."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
