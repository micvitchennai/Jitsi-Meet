import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ensureSeedEvents } from "@/lib/seed";
import { formatEventWindow, getMeetUrl, getStatus, serializeEvent, type SerializedEvent } from "@/lib/events";
import Registration from "@/models/Registration";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Events | MIC Meet Portal",
  description: "Registered Microsoft Innovations Club events and live meeting links.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) redirect("/login");

  await connectToDatabase();
  await ensureSeedEvents();

  const registrations = await Registration.find({ userId: session.user.id }).populate("eventId").sort({ registeredAt: -1 });
  const events = registrations
    .map((registration) => registration.eventId)
    .filter(Boolean)
    .map((event) => serializeEvent(event as never));

  const live = events.filter((event) => getStatus(event.startTime, event.endTime, event.statusOverride) === "Live");
  const upcoming = events.filter((event) => getStatus(event.startTime, event.endTime, event.statusOverride) === "Upcoming");
  const past = events.filter((event) => getStatus(event.startTime, event.endTime, event.statusOverride) === "Ended");

  return (
    <div className="schedule-retro relative min-h-screen">
      <div className="stars-container" />
      <div className="neon-grid" />
      <div className="scanline-overlay" />
      <main className="main-shell relative z-10 py-12">
        <section className="hero mb-12">
          <h1 className="text-4xl font-black tracking-widest text-[#ffafd5]">MY EVENTS</h1>
          <div className="hero-rule mt-6" />
        </section>
        {events.length === 0 ? (
          <div className="event-card mx-auto max-w-2xl py-12 text-center">
            <h2 className="event-card__title mb-4">NO REGISTRATIONS</h2>
            <p className="mb-6 text-arcade-muted">Register for an upcoming session to see it here.</p>
            <Button asChild className="arcade-btn"><Link href="/schedule">BROWSE EVENTS</Link></Button>
          </div>
        ) : (
          <div className="space-y-12">
            <DashboardSection title="LIVE" events={live} />
            <DashboardSection title="UPCOMING" events={upcoming} />
            <DashboardSection title="PAST" events={past} />
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardSection({ title, events }: { title: string; events: SerializedEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section className="event-section">
      <div className="mb-6 border-l-4 border-[#79f2a1] pl-6">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="event-grid">
        {events.map((event) => {
          const status = getStatus(event.startTime, event.endTime, event.statusOverride);
          const { date, time } = formatEventWindow(event.startTime, event.endTime);

          return (
            <article key={event._id} className="event-card">
              <div className="event-card__content">
                <div className="event-card__topline">
                  <span className="tag tag-primary">{event.domain}</span>
                  <Badge variant={status === "Live" ? "success" : status === "Ended" ? "muted" : "secondary"}>{status}</Badge>
                </div>
                <h3 className="event-card__title mt-3">{event.title}</h3>
                <p className="mt-3 text-sm text-arcade-muted">{date} · {time}</p>
              </div>
              <div className="event-card__footer mt-6">
                {status === "Live" ? (
                  <Button asChild className="w-full join-now-button">
                    <a href={getMeetUrl(event.roomName)} target="_blank" rel="noreferrer">
                      JOIN MEET <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/events/${event._id}`}>VIEW DETAILS</Link>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
