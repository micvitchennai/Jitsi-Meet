import Event from "@/models/Event";

const seedEvents = [
  { title: "AI/ML Session 1", description: "Foundations of applied AI, model workflows, and practical automation.", domain: "AI/ML", type: "session", startTime: "2026-05-23T10:00:00+05:30", endTime: "2026-05-23T13:00:00+05:30", roomName: "ROOM-AIML-SESSION-1", isPublished: true },
  { title: "AI/ML Session 2", description: "Hands-on machine learning concepts, prompting patterns, and project ideas.", domain: "AI/ML", type: "session", startTime: "2026-05-26T10:00:00+05:30", endTime: "2026-05-26T13:00:00+05:30", roomName: "ROOM-AIML-SESSION-2", isPublished: true },
  { title: "Hackathon 1", description: "A 24-hour build sprint for teams to design, ship, and demo working prototypes.", domain: "Hackathon", type: "hackathon", startTime: "2026-05-29T12:00:00+05:30", endTime: "2026-05-30T12:00:00+05:30", roomName: "ROOM-HACKATHON-1", isPublished: true },
  { title: "CP Session 1", description: "Core problem-solving patterns, complexity thinking, and contest setup.", domain: "CP", type: "session", startTime: "2026-06-02T10:00:00+05:30", endTime: "2026-06-02T13:00:00+05:30", roomName: "ROOM-CP-SESSION-1", isPublished: true },
  { title: "CP Session 2", description: "Practice-driven algorithms session with debugging and timed challenges.", domain: "CP", type: "session", startTime: "2026-06-04T10:00:00+05:30", endTime: "2026-06-04T13:00:00+05:30", roomName: "ROOM-CP-SESSION-2", isPublished: true },
  { title: "UI/UX Session 1", description: "Interface fundamentals, user flows, wireframes, and design critique.", domain: "UI/UX", type: "session", startTime: "2026-06-09T10:00:00+05:30", endTime: "2026-06-09T13:00:00+05:30", roomName: "ROOM-UIUX-SESSION-1", isPublished: true },
  { title: "UI/UX Session 2", description: "Rapid prototyping, visual polish, and portfolio-ready product screens.", domain: "UI/UX", type: "session", startTime: "2026-06-11T10:00:00+05:30", endTime: "2026-06-11T13:00:00+05:30", roomName: "ROOM-UIUX-SESSION-2", isPublished: true },
  { title: "CyberSec Session 1", description: "Security basics, threat models, and safe hands-on vulnerability exploration.", domain: "CyberSec", type: "session", startTime: "2026-06-16T10:00:00+05:30", endTime: "2026-06-16T13:00:00+05:30", roomName: "ROOM-CYBERSEC-SESSION-1", isPublished: true },
  { title: "CyberSec Session 2", description: "Capture-the-flag preparation, tooling, and defensive security thinking.", domain: "CyberSec", type: "session", startTime: "2026-06-18T10:00:00+05:30", endTime: "2026-06-18T13:00:00+05:30", roomName: "ROOM-CYBERSEC-SESSION-2", isPublished: true },
  { title: "Dev Session 1", description: "Full-stack foundations, product architecture, and deployment workflows.", domain: "Dev", type: "session", startTime: "2026-06-23T10:00:00+05:30", endTime: "2026-06-23T13:00:00+05:30", roomName: "ROOM-DEV-SESSION-1", isPublished: true },
  { title: "Dev Session 2", description: "Project polish, API integration, and shipping reliable web experiences.", domain: "Dev", type: "session", startTime: "2026-06-25T10:00:00+05:30", endTime: "2026-06-25T13:00:00+05:30", roomName: "ROOM-DEV-SESSION-2", isPublished: true },
  { title: "Hackathon 2", description: "The closing 24-hour innovation challenge with final demos and judging.", domain: "Hackathon", type: "hackathon", startTime: "2026-06-29T12:00:00+05:30", endTime: "2026-06-30T12:00:00+05:30", roomName: "ROOM-HACKATHON-2", isPublished: true },
] as const;

let seeded = false;

export async function ensureSeedEvents() {
  if (seeded) return;

  for (const event of seedEvents) {
    const matches = await Event.find({ title: event.title }).sort({ createdAt: 1, _id: 1 });

    if (matches.length === 0) {
      await Event.create(event);
      continue;
    }

    const [primary, ...duplicates] = matches;
    if (duplicates.length > 0) {
      await Event.deleteMany({ _id: { $in: duplicates.map((duplicate) => duplicate._id) } });
    }

    await Event.updateOne(
      { _id: primary._id },
      {
        $set: {
          description: event.description,
          domain: event.domain,
          type: event.type,
          startTime: event.startTime,
          endTime: event.endTime,
          roomName: event.roomName,
          isPublished: event.isPublished,
        },
        $setOnInsert: { statusOverride: "auto" },
      },
    );
  }

  seeded = true;
}
