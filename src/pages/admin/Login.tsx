import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/adminApi";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border border-neutral-800 rounded-lg p-8 bg-neutral-900">
        <p className="text-xs font-mono uppercase tracking-widest text-rust-light mb-1">Anand Techno-Fab</p>
        <h1 className="text-xl font-semibold text-white mb-6">Admin Sign In</h1>
        <label className="block text-xs font-mono uppercase tracking-wide text-neutral-400 mb-2">Password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2.5 text-sm text-neutral-100 mb-4"
        />
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-rust hover:bg-rust-dark text-white py-2.5 rounded text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
