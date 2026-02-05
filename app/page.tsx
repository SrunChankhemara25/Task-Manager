"use client";

import Link from "next/link";
import {
  CheckSquare,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Bell,
  Users,
  Shield,
  BarChart3,
  Sparkles,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CheckCircle2,
    title: "Task Management",
    description:
      "Create, organize, and track your tasks with priorities and due dates. Never miss a deadline again.",
  },
  {
    icon: FolderKanban,
    title: "Categories",
    description:
      "Organize tasks into custom categories to keep your work and personal life separate and organized.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get timely reminders about upcoming deadlines and important tasks so you stay on track.",
  },
   {
    icon: Shield,
    title: "Secure Access",
    description:
      "Your data is protected with verification codes on every sign-into keep your tasks private.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Visualize your productivity with progress charts and completion statistics.",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Admin panel to manage users, view all tasks, and send system notifications.",
  },
 
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9">
              <img src="/logo.png" alt="Logo" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Vyntic
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              asChild
              className="bg-transparent text-foreground transition-colors hover:bg-primary hover:text-black"
            >
              <Link href="/login">Sign In</Link>
            </Button>


            <Button size="sm" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <img className="h-4 w-4" src="/k-9.png" alt="Logo" />
              Simplify your workflow today
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance leading-tight">
              Organize Your Work
              <br />
              <p>and life, <span className="text-primary">finally.</span></p>
              
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Vyntic is a simple yet powerful task management tool designed to help you stay focused, organized, and in control of your daily tasks and projects.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/register">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-transparent text-foreground transition-colors hover:bg-primary hover:text-black"
                asChild
              >
                <Link href="/login">Sign In to Your Account</Link>
              </Button>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-foreground/3">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Features
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Everything You Need to Stay productive
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powerful features designed to help you manage tasks efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-5">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto p-8 lg:p-12 rounded-3xl text-center overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/45 via-primary/20 to-black/45">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 text-balance">
              Ready to get organized?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-pretty">
              Join thousands of users who have transformed their productivity with Vyntic.
            </p>
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8">
                <img src="/logo.png" alt="logo" />
              </div>
              <span className="font-semibold text-foreground">Vyntic</span>
              <p className="pl-50 text-sm text-muted-foreground">Privacy Policy <span className="pl-10">Term of use</span></p>
            </div>
            <p className="text-sm text-muted-foreground">
              Copyright © 2026 Vyntic Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
