import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Iresh & Asha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setError(error.message);
      else setInfo("Account created. You can sign in now.");
    }
    setBusy(false);
  };

  return (
    <main className="grid min-h-[100svh] place-items-center px-5 py-10">
      <div className="glass-card w-full max-w-sm rounded-3xl p-7">
        <div className="text-center">
          <div
            className="mx-auto grid h-12 w-12 place-items-center rounded-full text-white"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Heart className="h-5 w-5" />
          </div>
          <h1 className="mt-3 font-display text-2xl">Admin Sign In</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            For Iresh & Asha to manage guests and view RSVPs
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 ring-ring/40"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 ring-ring/40"
          />
          {error && <p className="text-center text-xs text-destructive">{error}</p>}
          {info && <p className="text-center text-xs text-emerald-600">{info}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full py-3 text-sm font-medium text-white shadow-gold disabled:opacity-50"
            style={{ background: "var(--gradient-gold)" }}
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "First time? Create admin account"
            : "Already have an account? Sign in"}
        </button>

        <div className="mt-5 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to invitation
          </Link>
        </div>
      </div>
    </main>
  );
}
