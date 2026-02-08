"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function PasswordResetSuccess() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToLogin = () => {
    setIsLoading(true);
    // Small delay to show loading spinner
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 500);
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
        <div className="w-full max-w-md text-center space-y-6">
          <img
            src="/k-7.png"
            alt="logo"
            className="w-10 mt-7 mb-7 mx-auto"
          />

          <h2 className="text-2xl font-bold text-foreground">
            Password reset successful
          </h2>

          <p className="text-muted-foreground">
            Your password has been updated. You can now sign in with your new password.
          </p>

          <Button
            type="button"
            className="w-full h-12 text-base flex items-center justify-center"
            onClick={handleGoToLogin}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Go to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
