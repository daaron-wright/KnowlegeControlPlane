"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const { error } = await resetPassword(email);

      if (error) {
        throw error;
      }

      setMessage("Password reset instructions have been sent to your email");
      setEmail("");
    } catch (error: any) {
      console.error("Reset password error:", error);
      setMessage(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-xl text-center mb-4 text-gray-700">Reset Password</h2>
      <p className="text-sm text-center mb-6 text-gray-500">
        Enter your email address and we'll send you instructions to reset your
        password.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 focus:border-amber-500 focus:outline-none"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Submit button */}
        <div className="mb-6">
          <button
            type="submit"
            className="w-full rounded-full bg-[#333333] px-6 py-3 text-white hover:bg-gray-700 focus:outline-none disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Reset Password"}
          </button>
        </div>

        {/* Status message */}
        {message && (
          <div className="mb-4 text-center text-sm">
            <p
              className={
                message.includes("error") || message.includes("An error")
                  ? "text-red-500"
                  : "text-green-600"
              }
            >
              {message}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="mb-4 border-t border-gray-200"></div>

        {/* Back to login link */}
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="text-center text-sm text-amber-500 hover:text-amber-600"
          >
            Back to Login
          </Link>
        </div>

        {/* Second divider */}
        <div className="border-t border-gray-200"></div>
      </form>
    </>
  );
}
