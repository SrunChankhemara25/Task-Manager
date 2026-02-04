"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateNewPassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      return alert("Passwords do not match");
    }

    setIsLoading(true);

    // Simulate API password reset
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to success page instead of showing alert
      router.push("/password-reset-success");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-15 h-15">
                <Link href="/"><img src="/logo.png" alt="logo" /></Link>
                
            </div>
            <span className="text-2xl font-semibold text-foreground">Vytic</span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight text-balance">
              Organize your work <br /> and life, finally.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              A simple yet powerful task management tool designed to help you stay focused,
              organized, and in control of your daily tasks and projects.
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2.5 h-2.5 rounded-full bg-muted-foreground shrink-0"></span>
              <p>Create and manage tasks with ease</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2.5 h-2.5 rounded-full bg-muted-foreground shrink-0"></span>
              <p>Organize with categories and priorities</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2.5 h-2.5 rounded-full bg-muted-foreground shrink-0"></span>
              <p>Stay on track with smart notifications</p>
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Trusted by thousands of users worldwide
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md text-center lg:text-left space-y-4">
          <img src="/k-6.png" alt="logo" className="w-10 mt-7 mb-7 mx-auto lg:mx-0" />

          <h2 className="text-2xl font-bold text-foreground">Create New Password</h2>
          <p className="text-muted-foreground mb-5">Enter your new password below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 bg-secondary border-border pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="h-12 bg-secondary border-border pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
