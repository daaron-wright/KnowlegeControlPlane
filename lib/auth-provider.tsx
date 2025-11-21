"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Define types for the auth context
interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
  expiresAt: number;
}

interface AuthError {
  message: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

// Hardcoded credentials
const VALID_CREDENTIALS = {
  email: "pedro.clem@kyndryl.com",
  password: "pedro.clem",
};

// Create the auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session in localStorage
    const getInitialSession = () => {
      setIsLoading(true);

      try {
        const storedSession = localStorage.getItem("auth_session");
        console.log(
          "Checking for stored session:",
          storedSession ? "Found" : "Not found"
        );

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);

          // Check if session has expired
          if (parsedSession.expiresAt && Date.now() < parsedSession.expiresAt) {
            console.log(
              "Restoring valid session for user:",
              parsedSession.user?.email
            );
            setSession(parsedSession);
            setUser(parsedSession.user);
          } else {
            console.log("Session has expired, clearing stored session");
            localStorage.removeItem("auth_session");
          }
        } else {
          console.log("No stored session found");
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        // Clear corrupted session data
        localStorage.removeItem("auth_session");
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure localStorage is ready
    if (typeof window !== "undefined") {
      setTimeout(getInitialSession, 100);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // Check against hardcoded credentials
      if (
        email === VALID_CREDENTIALS.email &&
        password === VALID_CREDENTIALS.password
      ) {
        const newUser = { id: "1", email };
        const newSession = {
          user: newUser,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };

        console.log("Sign in successful, storing session for:", email);

        // Store session in localStorage
        localStorage.setItem("auth_session", JSON.stringify(newSession));

        // Verify it was stored
        const stored = localStorage.getItem("auth_session");
        console.log("Session stored successfully:", !!stored);

        setUser(newUser);
        setSession(newSession);
        return { error: null };
      } else {
        console.log("Sign in failed: Invalid credentials");
        return { error: { message: "Invalid email or password" } };
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      // In a real app, this would create a new user
      // For now, we'll just pretend it worked if the email isn't already taken
      if (email === VALID_CREDENTIALS.email) {
        return { error: { message: "Email already in use" } };
      }

      return { error: null };
    } catch (error) {
      console.error("Error during sign up:", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Clear stored session
      localStorage.removeItem("auth_session");

      setUser(null);
      setSession(null);
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would send a reset email
      // For now, just pretend it worked
      return { error: null };
    } catch (error) {
      console.error("Error during password reset:", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  // The value to be provided to consuming components
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
