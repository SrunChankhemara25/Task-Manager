"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifySignUp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || ""; // Get email from sign-up page
  const router = useRouter();

  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [code, setCode] = useState(Array(6).fill("")); // 6-digit code
  const [isLoading, setIsLoading] = useState(false);

  // Auto-advance input on typing
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move focus backwards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);

      if (!code[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API verification call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to user account page after successful sign-up verification
      router.push("/user/dashboard"); // replace with your actual account page
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border p-12 flex-col justify-between">
        {/* Branding content same as before */}
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
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left space-y-4">
            <Link href="/signup" className="hover:underline flex items-center gap-2">
              <img src="/k-3.png" alt="back-arrow" className="w-5" />
              Back to sign up
            </Link>

            <img src="/logo-1.png" alt="logo" className="w-10 mt-7 mb-7 mx-auto lg:mx-0" />

            <h2 className="text-2xl font-bold text-foreground">Verify your email</h2>

            <p className="mt-2 text-muted-foreground">
              We've sent a 6-digit verification code to <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>

            <p className="mt-4 text-sm text-foreground">Verification code</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center gap-2 mt-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => { if (el) inputsRef.current[index] = el; }}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Verify Code and create account
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Didn't receive the code? </span>
              <Link href="" className="font-medium text-primary hover:underline">
                Resend
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
