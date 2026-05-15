"use client";

import { useState, useEffect } from "react";
import { Calendar, Video, ExternalLink, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEventWindow, getStatus, type SerializedEvent } from "@/lib/events";
import Link from "next/link";
import { RegisterDialog } from "./RegisterDialog";
import { departments, hackathons, type EventCard } from "@/lib/event-data";
import { SymbolIcon } from "./event-cards";

export function ScheduleClient({
  initialEvents,
  userRegistrations,
  isVitStudent,
}: {
  initialEvents: SerializedEvent[];
  userRegistrations: string[]; // event IDs
  isVitStudent: boolean;
}) {
  const [registrations, setRegistrations] = useState<string[]>(userRegistrations);
  const [selectedEvent, setSelectedEvent] = useState<SerializedEvent | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // State for the static event-data modal
  const [selectedStaticEvent, setSelectedStaticEvent] = useState<EventCard | null>(null);

  const [filter, setFilter] = useState<string>("All");

  // Auto-refresh status every 30s
  useEffect(() => {
    const interval = setInterval(() => { }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = initialEvents.filter(event =>
    filter === "All" || event.domain === filter
  );

  const liveEvents = filteredEvents.filter((event) => getStatus(event.startTime, event.endTime) === "Live");

  const handleRegisterSuccess = () => {
    if (selectedEvent) {
      setRegistrations((prev) => [...prev, selectedEvent._id]);
    }
  };

  return (
    <div className="space-y-16">
      {/* Filter Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex flex-wrap gap-1 justify-center">
          {["All", "AI/ML", "CP", "UI/UX", "CyberSec", "Dev", "Hackathon"].map((domain) => (
            <button
              key={domain}
              onClick={() => setFilter(domain)}
              className={`px-4 py-2 rounded-lg text-xs font-black tracking-widest transition-all ${filter === domain
                  ? "bg-[#ffafd5] text-black shadow-[0_0_15px_rgba(255,175,213,0.4)]"
                  : "text-arcade-muted hover:text-white hover:bg-white/5"
                }`}
            >
              {domain.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-24">
        {/* Live Now Section */}
        <LiveEventSection
          events={liveEvents}
          registrations={registrations}
          onRegisterClick={(event) => {
            setSelectedEvent(event);
            setIsRegisterOpen(true);
          }}
        />

        {/* Upcoming Events — Retro Category Grid */}
        <UpcomingEventsSection
          onCardClick={(event) => setSelectedStaticEvent(event)}
        />

        {selectedEvent && (
          <RegisterDialog
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            eventId={selectedEvent._id}
            eventTitle={selectedEvent.title}
            isVitStudent={isVitStudent}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </div>

      {/* Static Event Modal */}
      {selectedStaticEvent && (
        <StaticEventModal
          event={selectedStaticEvent}
          onClose={() => setSelectedStaticEvent(null)}
          isVitStudent={isVitStudent}
        />
      )}
    </div>
  );
}

// ─── Live Events Section ──────────────────────────────────────────────────────

function LiveEventSection({
  events,
  registrations,
  onRegisterClick,
}: {
  events: SerializedEvent[];
  registrations: string[];
  onRegisterClick: (event: SerializedEvent) => void;
}) {
  if (events.length === 0) return null;

  return (
    <section className="event-section">
      <div className="mb-10 text-left border-l-4 border-[#79f2a1] pl-6">
        <h2 className="section-title mb-2" style={{ color: "#79f2a1" }}>LIVE NOW</h2>
        <p className="text-arcade-muted text-sm tracking-widest opacity-80 uppercase">
          Active sessions requiring immediate attention.
        </p>
      </div>
      <div className="event-grid">
        {events.map((event) => {
          const { date, time } = formatEventWindow(event.startTime, event.endTime);
          const isRegistered = registrations.includes(event._id);
          const canJoin = isRegistered;

          return (
            <div key={event._id} className="event-card border-[#79f2a1]/40 shadow-[0_0_20px_rgba(121,242,161,0.1)]">
              <div className="event-card__content">
                <div className="event-card__topline">
                  <span className="tag tag-green">SYSTEM LIVE</span>
                  <span className="live-badge"><span></span> LIVE</span>
                </div>
                <span className="event-card__title mt-2">{event.title}</span>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-arcade-muted">
                    <Calendar className="h-3 w-3" /> {date}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-arcade-muted">
                    <Video className="h-3 w-3" /> {time}
                  </div>
                </div>
                {isRegistered && (
                  <div className="mt-4 text-xs font-black tracking-widest text-[#79f2a1] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#79f2a1]" />
                    REGISTERED
                  </div>
                )}
              </div>
              <div className="event-card__footer mt-6">
                {canJoin ? (
                  <Link href={`https://meet.jit.si/${event.roomName}`} target="_blank" className="w-full">
                    <Button className="join-now-button w-full font-black tracking-widest gap-2">
                      JOIN MEETING <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full arcade-btn-secondary opacity-80"
                    onClick={() => onRegisterClick(event)}
                  >
                    REGISTER TO JOIN
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Upcoming Events Section (Retro Category Grid) ───────────────────────────

function UpcomingEventsSection({ onCardClick }: { onCardClick: (event: EventCard) => void }) {
  return (
    <section className="event-section">
      {/* Section heading */}
      <div className="mb-12 text-left border-l-4 border-[#ffafd5] pl-6">
        <h2 className="section-title mb-2" style={{ color: "#ffafd5" }}>UPCOMING</h2>
        <p className="text-arcade-muted text-sm tracking-widest opacity-80 uppercase">
          Future transmissions scheduled for broadcast — Microsoft Innovations Club
        </p>
      </div>

      <div className="space-y-16">
        {/* Workshop Categories */}
        {departments.map((dept) => (
          <CategoryBlock
            key={dept.name}
            name={dept.name}
            accent={dept.accent}
            events={dept.events}
            onCardClick={onCardClick}
          />
        ))}

        {/* Hackathons */}
        <HackathonBlock events={hackathons} onCardClick={onCardClick} />
      </div>
    </section>
  );
}

// ─── Category Block ───────────────────────────────────────────────────────────

const accentColors = {
  blue: { heading: "#4285f4", border: "#4285f4", tag: "tag-blue", glow: "rgba(66,133,244,0.18)", text: "text-blue" },
  green: { heading: "#34a853", border: "#34a853", tag: "tag-green", glow: "rgba(52,168,83,0.18)", text: "text-green" },
  red: { heading: "#ea4335", border: "#ea4335", tag: "tag-red", glow: "rgba(234,67,53,0.18)", text: "text-red" },
  yellow: { heading: "#fbbc04", border: "#fbbc04", tag: "tag-yellow", glow: "rgba(251,188,4,0.18)", text: "text-yellow" },
};

function CategoryBlock({
  name,
  accent,
  events,
  onCardClick,
}: {
  name: string;
  accent: "blue" | "green" | "red" | "yellow";
  events: EventCard[];
  onCardClick: (event: EventCard) => void;
}) {
  const colors = accentColors[accent];

  return (
    <div>
      {/* Category heading */}
      <div
        className="mb-6 pl-4 border-l-4"
        style={{ borderColor: colors.heading }}
      >
        <h3
          className="text-xl font-black tracking-[0.2em] uppercase"
          style={{ color: colors.heading }}
        >
          {name}
        </h3>
      </div>

      {/* Event cards grid — 2 per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {events.map((event, i) => (
          <RetroEventCard
            key={i}
            event={event}
            accent={accent}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hackathon Block ──────────────────────────────────────────────────────────

function HackathonBlock({
  events,
  onCardClick,
}: {
  events: EventCard[];
  onCardClick: (event: EventCard) => void;
}) {
  return (
    <div>
      <div className="mb-6 pl-4 border-l-4 border-[#fbbc04]">
        <h3 className="text-xl font-black tracking-[0.2em] uppercase text-[#fbbc04]">
          HACKATHONS
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {events.map((event, i) => (
          <HackathonEventCard key={i} event={event} onCardClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}

// ─── Retro Event Card ─────────────────────────────────────────────────────────

function RetroEventCard({
  event,
  accent,
  onCardClick,
}: {
  event: EventCard;
  accent: "blue" | "green" | "red" | "yellow";
  onCardClick: (event: EventCard) => void;
}) {
  const colors = accentColors[accent];
  const eventAccentColors = accentColors[event.accent] ?? colors;

  return (
    <button
      type="button"
      onClick={() => onCardClick(event)}
      className="retro-event-card text-left w-full"
      style={{
        background: "rgba(18, 19, 27, 0.92)",
        border: `2px solid ${eventAccentColors.border}`,
        padding: "22px",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        position: "relative",
        color: "var(--arcade-foreground)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 28px ${eventAccentColors.glow}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      {/* Top line: tag + icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span
          className={`tag ${eventAccentColors.tag}`}
          style={{ fontSize: "0.68rem", fontWeight: 800, padding: "4px 8px", border: `1px solid currentColor`, textTransform: "uppercase" }}
        >
          {event.type ?? "Workshop"}
        </span>
        <SymbolIcon
          name={event.icon}
          className={eventAccentColors.text}
          style={{ width: "1.2em", height: "1.2em" }}
        />
      </div>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <p
          className={`${eventAccentColors.text}`}
          style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.2, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.03em" }}
        >
          {event.title}
        </p>
        <p style={{ color: "var(--arcade-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
          {event.description}
        </p>
      </div>

      {/* Footer: level + meta icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          marginTop: "18px",
          paddingTop: "12px",
          color: "var(--arcade-muted)",
          fontSize: "0.72rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        <span>Level: {event.level}</span>
        <SymbolIcon
          name={event.metaIcon}
          className={eventAccentColors.text}
          style={{ width: "1.2em", height: "1.2em" }}
        />
      </div>
    </button>
  );
}

// ─── Hackathon Event Card ─────────────────────────────────────────────────────

function HackathonEventCard({
  event,
  onCardClick,
}: {
  event: EventCard;
  onCardClick: (event: EventCard) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCardClick(event)}
      className="text-left w-full"
      style={{
        background: "rgba(18, 19, 27, 0.92)",
        border: "2px solid #fbbc04",
        padding: "22px",
        minHeight: "240px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        position: "relative",
        overflow: "hidden",
        color: "var(--arcade-foreground)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px rgba(251,188,4,0.28)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      {/* Ribbon */}
      <span
        style={{
          position: "absolute",
          top: "20px",
          right: "-42px",
          background: "#ea4335",
          color: "white",
          fontSize: "0.62rem",
          fontWeight: 800,
          padding: "5px 52px",
          transform: "rotate(35deg)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Special Event
      </span>

      {/* Body */}
      <div style={{ flex: 1 }}>
        {/* Top line */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span
            style={{
              background: "#fbbc04",
              color: "#1a0e00",
              fontSize: "0.68rem",
              fontWeight: 800,
              padding: "4px 10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Hackathon
          </span>
          <SymbolIcon name={event.icon} className="text-yellow" style={{ width: "1.3em", height: "1.3em" }} />
        </div>

        {/* Title */}
        <p
          style={{
            fontFamily: "monospace",
            fontWeight: 800,
            fontSize: "1.3rem",
            lineHeight: 1.15,
            color: "#fbbc04",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "12px",
          }}
        >
          {event.title}
        </p>

        {/* Description */}
        <p style={{ color: "var(--arcade-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
          {event.description}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(251,188,4,0.2)",
          marginTop: "20px",
          paddingTop: "14px",
        }}
      >
        <span style={{ color: "#fbbc04", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {event.prize}
        </span>
        <SymbolIcon name={event.metaIcon} className="text-yellow" style={{ width: "1.2em", height: "1.2em" }} />
      </div>
    </button>
  );
}

// ─── Static Event Modal (click-to-expand poster + description + register) ─────

function StaticEventModal({
  event,
  onClose,
  isVitStudent,
}: {
  event: EventCard;
  onClose: () => void;
  isVitStudent: boolean;
}) {
  const [showRegister, setShowRegister] = useState(false);
  const colors = accentColors[event.accent] ?? accentColors.blue;

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="dialog-overlay"
        onClick={handleBackdropClick}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* Modal Panel */}
        <div
          className="modal-panel"
          style={{
            width: "min(600px, calc(100vw - 32px))",
            maxHeight: "min(88vh, 760px)",
            overflowY: "auto",
            borderColor: colors.border,
            position: "relative",
            boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 60px ${colors.glow}`,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--arcade-muted)",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 150ms, background 150ms",
            }}
            aria-label="Close modal"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "white";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--arcade-muted)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
            }}
          >
            <X size={18} />
          </button>

          {/* Poster / Banner */}
          <div
            style={{
              width: "100%",
              aspectRatio: "16/7",
              background: `linear-gradient(135deg, rgba(18,19,27,0.9) 0%, ${colors.glow.replace("0.18", "0.35")} 100%)`,
              border: `1px solid ${colors.border}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background grid pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${colors.border}18 1px, transparent 1px), linear-gradient(90deg, ${colors.border}18 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
            {/* Icon */}
            <SymbolIcon
              name={event.icon}
              className={colors.text}
              style={{ width: "4rem", height: "4rem", opacity: 0.85, position: "relative", zIndex: 1 }}
            />
            {/* Event type badge */}
            <span
              style={{
                position: "relative",
                zIndex: 1,
                background: colors.border,
                color: event.accent === "yellow" ? "#1a0e00" : "white",
                fontSize: "0.68rem",
                fontWeight: 800,
                padding: "5px 14px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {event.type ?? "Workshop"}
            </span>
          </div>

          {/* Content */}
          <div className="dialog-header">
            {/* Category badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span
                className={`tag ${colors.tag}`}
                style={{ fontSize: "0.7rem", fontWeight: 800, padding: "4px 10px", border: `1px solid currentColor`, textTransform: "uppercase" }}
              >
                {event.department}
              </span>
              <span style={{ color: "var(--arcade-muted)", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Level: {event.level}
              </span>
            </div>

            {/* Title */}
            <h2
              className={`dialog-title ${colors.text}`}
              style={{ fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              {event.title}
            </h2>

            {/* Description */}
            <p className="dialog-description" style={{ fontSize: "1rem", lineHeight: 1.65 }}>
              {event.description}
            </p>

            {event.prize && (
              <div
                style={{
                  background: "rgba(251,188,4,0.08)",
                  border: "1px solid rgba(251,188,4,0.3)",
                  padding: "12px 16px",
                  marginTop: "8px",
                }}
              >
                <span style={{ color: "#fbbc04", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  🏆 {event.prize}
                </span>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="modal-actions" style={{ justifyContent: "stretch", flexDirection: "column" }}>
            <Button
              className="w-full h-12 font-black tracking-widest gap-2"
              style={{
                background: colors.border,
                color: event.accent === "yellow" ? "#1a0e00" : "white",
                border: "none",
                fontSize: "0.9rem",
              }}
              onClick={() => setShowRegister(true)}
            >
              <UserPlus className="h-4 w-4" />
              REGISTER FOR THIS EVENT
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 font-black tracking-widest"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--arcade-muted)", background: "transparent" }}
              onClick={onClose}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </div>

      {/* Registration dialog triggered from modal */}
      {showRegister && (
        <RegisterDialog
          isOpen={showRegister}
          onClose={() => {
            setShowRegister(false);
            onClose();
          }}
          eventId={`static-${event.title.toLowerCase().replace(/\s+/g, "-")}`}
          eventTitle={event.title}
          isVitStudent={isVitStudent}
          onSuccess={() => {
            setShowRegister(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
