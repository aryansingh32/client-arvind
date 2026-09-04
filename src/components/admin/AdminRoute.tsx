import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../../lib/adminApi";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"checking" | "authed" | "guest">("checking");

  useEffect(() => {
    checkAuth()
      .then((res) => setStatus(res.authenticated ? "authed" : "guest"))
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-500 text-sm font-mono">
        Checking session…
      </div>
    );
  }
  if (status === "guest") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
