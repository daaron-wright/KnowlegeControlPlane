"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);

    try {
      // Simulate password update
      // In a real app with a real backend, we would call an API endpoint here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h2 className="text-xl mb-4 text-gray-700">Password Updated</h2>
          <p className="text-sm mb-6 text-gray-500">
            Your password has been updated successfully. Redirecting to login...
          </p>
          <Link 
            href="/"
            className="text-amber-500 hover:text-amber-600"
          >
            Click here if you're not redirected automatically
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl text-center mb-4 text-gray-700">
        Set New Password
      </h2>
      <p className="text-sm text-center mb-6 text-gray-500">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit}>
        {/* New Password input */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 focus:border-amber-500 focus:outline-none"
            disabled={isSubmitting}
            required
            minLength={6}
          />
        </div>

        {/* Confirm Password input */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 focus:border-amber-500 focus:outline-none"
            disabled={isSubmitting}
            required
            minLength={6}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <div className="mb-6">
          <button
            type="submit"
            className="w-full rounded-full bg-[#333333] px-6 py-3 text-white hover:bg-gray-700 focus:outline-none disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
