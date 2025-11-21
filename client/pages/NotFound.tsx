import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-base px-6 text-center">
      <div className="rounded-3xl border border-border/70 bg-card px-10 py-12 shadow-lg">
        <p className="text-sm font-semibold text-primary">Error 404</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          We couldn't locate that workspace
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Double-check the URL or head back to the regulated knowledge dashboard to continue
          your review.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
