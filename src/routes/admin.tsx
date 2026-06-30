import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Check, X, Trash2, Plus, LogOut, Copy, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Iresh & Asha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Guest = { code: string; name: string; title: string | null; seats: number; created_at: string };
type Rsvp = { id: string; guest_code: string; attending: boolean; message: string | null; created_at: string };

function randCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [seats, setSeats] = useState(2);
  const [code, setCode] = useState(randCode());
  const [busy, setBusy] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const load = useCallback(async () => {
    const [g, r] = await Promise.all([
      supabase.from("guests").select("*").order("created_at", { ascending: false }),
      supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
    ]);
    setGuests((g.data as Guest[]) ?? []);
    setRsvps((r.data as Rsvp[]) ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      await load();
      setReady(true);
    })();
  }, [navigate, load]);

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("guests").insert({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      title: title.trim() || null,
      seats,
    });
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    setName("");
    setTitle("");
    setSeats(2);
    setCode(randCode());
    await load();
  };

  const removeGuest = async (code: string) => {
    if (!confirm(`Delete guest ${code}? Their RSVPs will also be removed.`)) return;
    await supabase.from("guests").delete().eq("code", code);
    await load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const copyLink = async (code: string) => {
    const url = `${origin}/?code=${code}`;
    await navigator.clipboard.writeText(url);
  };

  const guestByCode = (c: string) => guests.find((g) => g.code === c);

  if (!ready) {
    return (
      <main className="grid min-h-[100svh] place-items-center text-sm text-muted-foreground">
        Loading…
      </main>
    );
  }

  const accepted = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const acceptedSeats = accepted.reduce(
    (sum, r) => sum + (guestByCode(r.guest_code)?.seats ?? 0),
    0,
  );

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Wedding Admin</h1>
          <p className="text-xs text-muted-foreground">Manage guests & view RSVPs</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-full border border-border bg-white/70 px-4 py-2 text-xs hover:bg-white"
          >
            View site
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-4 py-2 text-xs hover:bg-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <Stat label="Total guests" value={guests.length} />
        <Stat label="Accepted" value={`${accepted.length} (${acceptedSeats} seats)`} accent="emerald" />
        <Stat label="Declined" value={declined.length} accent="rose" />
      </section>

      <section className="glass-card mt-6 rounded-3xl p-5">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg">
          <Plus className="h-4 w-4" /> Add guest
        </h2>
        <form onSubmit={addGuest} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <input
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="sm:col-span-2 rounded-xl border border-input bg-white/70 px-3 py-2 text-sm"
          />
          <input
            placeholder="Title (Mr/Ms…)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-input bg-white/70 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={1}
            max={20}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
            className="rounded-xl border border-input bg-white/70 px-3 py-2 text-sm"
            placeholder="Seats"
          />
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-input bg-white/70 px-3 py-2 text-sm font-mono"
              placeholder="Code"
            />
            <button
              type="button"
              onClick={() => setCode(randCode())}
              className="rounded-xl border border-border bg-white/70 px-2 text-xs hover:bg-white"
              title="Regenerate code"
            >
              ↻
            </button>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="sm:col-span-5 rounded-full py-2.5 text-sm font-medium text-white shadow-gold disabled:opacity-50"
            style={{ background: "var(--gradient-gold)" }}
          >
            {busy ? "Adding…" : "Add guest"}
          </button>
        </form>
      </section>

      <section className="glass-card mt-6 overflow-hidden rounded-3xl">
        <header className="border-b border-border/60 px-5 py-3">
          <h2 className="font-display text-lg">Guests ({guests.length})</h2>
        </header>
        {guests.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No guests yet. Add your first guest above.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {guests.map((g) => {
              const guestRsvps = rsvps.filter((r) => r.guest_code === g.code);
              const latest = guestRsvps[0];
              return (
                <li key={g.code} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {g.title ? `${g.title} ` : ""}{g.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{g.code}</span> · {g.seats} seats
                    </p>
                  </div>
                  <div>
                    {latest ? (
                      <StatusPill attending={latest.attending} />
                    ) : (
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Pending
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyLink(g.code)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs hover:bg-white"
                    title="Copy invitation link"
                  >
                    <Copy className="h-3 w-3" /> Link
                  </button>
                  <button
                    onClick={() => removeGuest(g.code)}
                    className="rounded-full border border-border bg-white/70 p-1.5 text-destructive hover:bg-white"
                    title="Delete guest"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="glass-card mt-6 overflow-hidden rounded-3xl">
        <header className="border-b border-border/60 px-5 py-3">
          <h2 className="font-display text-lg">Responses ({rsvps.length})</h2>
        </header>
        {rsvps.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No responses yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rsvps.map((r) => {
              const g = guestByCode(r.guest_code);
              return (
                <li key={r.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {g ? `${g.title ? g.title + " " : ""}${g.name}` : r.guest_code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">{r.guest_code}</span> ·{" "}
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <StatusPill attending={r.attending} />
                  </div>
                  {r.message && (
                    <p className="mt-2 rounded-2xl bg-white/60 px-3 py-2 text-xs italic text-muted-foreground">
                      “{r.message}”
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="mt-8 flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
        Made with <Heart className="h-3 w-3 text-rose" /> for Iresh & Asha
      </p>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "emerald" | "rose";
}) {
  const color =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "rose"
        ? "text-rose-600"
        : "text-foreground";
  return (
    <div className="glass-card rounded-2xl p-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-xl ${color}`}>{value}</p>
    </div>
  );
}

function StatusPill({ attending }: { attending: boolean }) {
  return attending ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
      <Check className="h-3 w-3" /> Accepted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-medium text-rose-700">
      <X className="h-3 w-3" /> Declined
    </span>
  );
}
