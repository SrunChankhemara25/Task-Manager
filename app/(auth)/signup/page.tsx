"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const success = await register(email, password, fullName);

   if (success) {
      router.push(`/verify-signup?email=${encodeURIComponent(email)}`);
    }else {
      setError("Email already exists. Please use a different email.");
    }
    setIsLoading(false);
  };

  const features = [
    "Unlimited task creation",
    "Custom categories",
    "Priority management",
    "Progress tracking",
  ];

  return (
    <div className="min-h-screen flex bg-background">
       {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-15 h-15">
              <Link href="/"><img src="/logo.png" alt="logo" /></Link>
            </div>
            <span className="text-2xl font-semibold text-foreground">
              Vytic
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight text-balance">
              Organize your work 
              <br />
              and life, finally.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              A simple yet powerful task management tool designed to help you stay focused, organized, and in control of your daily tasks and projects.
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

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10">
              <Link href="/"><img src="/logo.png" alt="logo" /></Link>
            </div>
            <span className="text-xl font-semibold text-foreground">
              Vytic
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              Create an account
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sign up to start managing your tasks
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 bg-secondary border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-secondary border-border pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-secondary border-border"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
