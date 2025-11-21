"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";

export function LoginForm() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Attempting to sign in with:", email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Authentication error:", error);
        setError(error.message);
        return;
      }

      // Authentication successful
      console.log("Authentication successful, redirecting to /prompt");
      router.push("/prompt");
    } catch (err: any) {
      console.error("Network or connection error:", err);

      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(`Unexpected error: ${err?.message || "Unknown error"}`);
      }
    }
  };

  return (
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

      {/* Error message */}
      {error && (
        <div className="mb-4 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Sign In button */}
      <div className="mb-6">
        <button
          type="submit"
          className="w-full rounded-full bg-[#404042] px-6 py-3 text-white hover:bg-gray-700 focus:outline-none disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      {/* First divider */}
      <div className="mb-4 border-t" style={{ borderColor: "#775A0B" }}></div>

      {/* Forgot Password link */}
      <div className="mb-4 text-center">
        <Link
          href="/forgot-password"
          className="text-center text-sm hover:opacity-80"
          style={{ color: "#775A0B" }}
        >
          Forgot Password?
        </Link>
      </div>

      {/* Second divider */}
      <div className="mb-4 border-t" style={{ borderColor: "#775A0B" }}></div>

      {/* Sign Up link */}
      <div className="text-center">
        <Link
          href="/signup"
          className="text-center text-sm hover:opacity-80"
          style={{ color: "#775A0B" }}
        >
          Don't have an account? Sign Up
        </Link>
      </div>
    </form>
  );
}
