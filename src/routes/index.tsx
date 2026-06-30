import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, Sparkles, Heart, ChevronRight, Apple, Mail } from "lucide-react";
import { RosePetals } from "@/components/RosePetals";
import { RoseCorner } from "@/components/RoseCorner";
import { Countdown } from "@/components/Countdown";
import { MusicPlayer } from "@/components/MusicPlayer";
import { WEDDING, downloadICS, googleCalendarUrl, outlookCalendarUrl } from "@/lib/wedding";
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Iresh & Asha — Wedding Invitation" },
      { name: "description", content: "Together with their families. Join Iresh & Asha on 26 August 2026 at The Epitome Hotel, Crown Ballroom." },
      { property: "og:title", content: "Iresh & Asha — Wedding Invitation" },
      { property: "og:description", content: "26 August 2026 · The Epitome Hotel · Crown Ballroom" },
      { property: "og:image", content: couple1 },
    ],
  }),
  component: Home,
});

function Ornament() {
  return (
    <div className="divider-ornament my-4">
      <span className="divider-line" />
      <Sparkles className="h-4 w-4" />
      <span className="divider-line" />
    </div>
  );
}

function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <RosePetals />
      <MusicPlayer />

      <Hero />
      <Details />
      <Story />
      <Schedule />
      <Gallery />
      <CalendarSection />
      <RsvpCta />
      <Location />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] px-5 pt-12 pb-16">
      <RoseCorner position="tl" size={170} />
      <RoseCorner position="br" size={200} opacity={0.7} />

      <div className="relative z-20 mx-auto flex max-w-xl flex-col items-center text-center animate-fade-up">
        <p className="font-script text-lg italic tracking-wide text-rose">
          Together with their families
        </p>
        <Ornament />
        <h1 className="font-display text-6xl leading-[0.95] text-foreground sm:text-7xl md:text-8xl">
          Iresh
          <span className="mx-2 font-script italic text-gradient-gold">&</span>
          Asha
        </h1>
        <Ornament />
        <p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
          Request the pleasure of your company as we celebrate our wedding
        </p>

        <p className="mt-8 font-script text-xl italic text-foreground/80">
          The 26th of August, 2026
        </p>

        <div className="mt-6 w-full">
          <Countdown target={WEDDING.date} />
        </div>

        <a
          href="#rsvp"
          className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-gold transition-transform hover:scale-[1.03] active:scale-95"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Heart className="h-4 w-4" /> RSVP Now
        </a>
      </div>
    </section>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass-card group rounded-3xl p-5 text-center transition-transform hover:-translate-y-1">
      <div
        className="mx-auto grid h-12 w-12 place-items-center rounded-full text-white"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-xl text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Details() {
  return (
    <section className="relative px-5 py-20">
      <RoseCorner position="tr" size={140} opacity={0.55} />
      <div className="relative z-20 mx-auto max-w-xl text-center">
        <p className="font-script text-base italic text-rose">Save the date</p>
        <h2 className="mt-1 font-display text-4xl text-foreground">Wedding Details</h2>
        <Ornament />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          <DetailCard icon={Calendar} label="Date" value="26 Aug" sub="Wednesday, 2026" />
          <DetailCard icon={Clock} label="Poruwa" value="09:07 AM" sub="Auspicious time" />
          <DetailCard icon={Sparkles} label="Reception" value="9:00 AM" sub="Onwards" />
          <DetailCard icon={MapPin} label="Venue" value="The Epitome" sub="Crown Ballroom" />
        </div>
      </div>
    </section>
  );
}

function Story() {
  const moments = [
    { y: "2019", t: "We Met", d: "A chance meeting that felt like fate." },
    { y: "2022", t: "First Trip", d: "Wandering hills, falling deeper." },
    { y: "2025", t: "The Proposal", d: "A quiet evening. A forever yes." },
    { y: "2026", t: "We Marry", d: "Beginning our greatest chapter." },
  ];
  return (
    <section className="relative px-5 py-20">
      <div className="relative z-20 mx-auto max-w-xl">
        <div className="text-center">
          <p className="font-script text-base italic text-rose">Our journey</p>
          <h2 className="mt-1 font-display text-4xl">Our Story</h2>
          <Ornament />
        </div>

        <ol className="mt-8 space-y-4">
          {moments.map((m) => (
            <li key={m.y} className="glass-card flex items-start gap-4 rounded-2xl p-4">
              <div
                className="shrink-0 rounded-xl px-3 py-2 font-display text-sm text-white"
                style={{ background: "var(--gradient-gold)" }}
              >
                {m.y}
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg leading-tight">{m.t}</p>
                <p className="text-sm text-muted-foreground">{m.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Schedule() {
  const items = [
    { time: "09:00 AM", t: "Guest Arrival", d: "Welcome reception & refreshments" },
    { time: "09:07 AM", t: "Poruwa Ceremony", d: "Traditional Sri Lankan ceremony" },
    { time: "10:30 AM", t: "Photography", d: "Family portraits & couple session" },
    { time: "12:00 PM", t: "Lunch Reception", d: "Crown Ballroom" },
    { time: "02:30 PM", t: "Cake Cutting", d: "Toasts & celebration" },
  ];
  return (
    <section className="relative px-5 py-20">
      <RoseCorner position="bl" size={160} opacity={0.55} />
      <div className="relative z-20 mx-auto max-w-xl">
        <div className="text-center">
          <p className="font-script text-base italic text-rose">The day at a glance</p>
          <h2 className="mt-1 font-display text-4xl">Schedule</h2>
          <Ornament />
        </div>

        <div className="mt-6 space-y-3">
          {items.map((i) => (
            <div
              key={i.time}
              className="glass-card flex items-center gap-4 rounded-2xl p-4"
            >
              <div className="w-20 shrink-0 font-display text-sm text-gradient-gold">
                {i.time}
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{i.t}</p>
                <p className="text-xs text-muted-foreground">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const photos = [couple1, couple2, couple3];
  const [idx, setIdx] = useState(0);
  return (
    <section className="relative px-5 py-20">
      <div className="relative z-20 mx-auto max-w-xl">
        <div className="text-center">
          <p className="font-script text-base italic text-rose">Captured moments</p>
          <h2 className="mt-1 font-display text-4xl">Gallery</h2>
          <Ornament />
        </div>

        <div className="relative mt-6 overflow-hidden rounded-3xl shadow-soft">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                alt={`Iresh and Asha photo ${i + 1}`}
                loading="lazy"
                width={1280}
                height={1600}
                className="aspect-[4/5] w-full shrink-0 object-cover"
              />
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CalButton({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: typeof Calendar;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "glass-card flex items-center gap-3 rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.98]";
  const inner = (
    <>
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">Add to calendar</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function CalendarSection() {
  return (
    <section className="relative px-5 py-20">
      <RoseCorner position="tl" size={140} opacity={0.55} />
      <div className="relative z-20 mx-auto max-w-xl">
        <div className="text-center">
          <p className="font-script text-base italic text-rose">Save the moment</p>
          <h2 className="mt-1 font-display text-4xl">Add to Calendar</h2>
          <Ornament />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CalButton icon={Apple} label="Apple Calendar" onClick={() => downloadICS()} />
          <CalButton icon={Calendar} label="Google Calendar" href={googleCalendarUrl()} />
          <CalButton icon={Mail} label="Outlook Calendar" href={outlookCalendarUrl()} />
          <CalButton icon={Calendar} label="Samsung Calendar" onClick={() => downloadICS("samsung-wedding.ics")} />
        </div>
      </div>
    </section>
  );
}

function RsvpCta() {
  return (
    <section id="rsvp" className="relative px-5 py-20">
      <div className="relative z-20 mx-auto max-w-xl">
        <div
          className="glass-card relative overflow-hidden rounded-3xl p-8 text-center"
        >
          <RoseCorner position="tr" size={120} opacity={0.5} />
          <p className="font-script text-base italic text-rose">Kindly respond</p>
          <h2 className="mt-1 font-display text-4xl">RSVP</h2>
          <Ornament />
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Please open the invitation link sent to you to RSVP.
          </p>
          <Link
            to="/rsvp"
            search={{ code: "DEMO" }}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-gold transition-transform hover:scale-[1.03]"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Heart className="h-4 w-4" /> View Sample RSVP
          </Link>
        </div>
      </div>
    </section>
  );
}

function Location() {
  const q = encodeURIComponent("The Epitome Hotel Colombo");
  return (
    <section className="relative px-5 py-20">
      <div className="relative z-20 mx-auto max-w-xl">
        <div className="text-center">
          <p className="font-script text-base italic text-rose">Find us</p>
          <h2 className="mt-1 font-display text-4xl">Location</h2>
          <Ornament />
          <p className="text-sm text-muted-foreground">
            The Epitome Hotel · Crown Ballroom
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl shadow-soft glass-card p-1.5">
          <iframe
            title="Venue map"
            className="h-72 w-full rounded-2xl"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${q}&output=embed`}
          />
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white/60 px-5 py-3 text-sm font-medium text-foreground backdrop-blur hover:bg-white"
        >
          <MapPin className="h-4 w-4" /> Open in Google Maps
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-5 pb-20 pt-10 text-center">
      <RoseCorner position="bl" size={150} opacity={0.6} />
      <RoseCorner position="br" size={150} opacity={0.6} />
      <div className="relative z-20 mx-auto max-w-md">
        <Ornament />
        <h3 className="font-script text-3xl italic text-gradient-gold">
          With love & gratitude
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Thank you for being part of our story. We can't wait to celebrate with you.
        </p>
        <p className="mt-6 font-display text-xl">Iresh <span className="font-script italic text-rose">&</span> Asha</p>
        <p className="mt-2 text-xs text-muted-foreground">26 · 08 · 2026</p>
      </div>
    </footer>
  );
}
