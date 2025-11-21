"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-provider";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      console.log("Signing up with:", email);
      const { error } = await signUp(email, password);

      if (error) {
        console.error("Registration error:", error);
        setError(error.message);
        return;
      }

      // Handle successful signup
      router.push("/prompt");
    } catch (err: any) {
      console.error("Network or connection error:", err);

      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err?.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 focus:border-amber-500 focus:outline-none"
            disabled={isLoading}
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 focus:border-amber-500 focus:outline-none"
            disabled={isLoading}
            required
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
            disabled={isLoading}
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Sign Up button */}
        <div className="mb-6">
          <button
            type="submit"
            className="w-full rounded-full bg-[#404042] px-6 py-3 text-white hover:bg-gray-700 focus:outline-none disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        {/* Divider */}
        <div className="mb-4 border-t" style={{ borderColor: "#775A0B" }}></div>

        {/* Back to Login link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-center text-sm hover:opacity-80"
            style={{ color: "#775A0B" }}
          >
            Already have an account? Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
