"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl",
            iconClassName || "bg-primary/10"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
