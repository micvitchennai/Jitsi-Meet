export type Accent = "blue" | "green" | "red" | "yellow";

export type EventCard = {
  title: string;
  description: string;
  department: string;
  level: string;
  accent: Accent;
  icon: string;
  metaIcon: string;
  type?: "Workshop" | "Hackathon";
  prize?: string;
  date?: string;
  time?: string;
};

export const departments: { name: string; accent: Accent; events: EventCard[] }[] = [
  {
    name: "UI/UX",
    accent: "blue",
    events: [
      {
        title: "Design, Break, Fix",
        description: "A deep dive into UI/UX Design methodologies for modern digital interfaces.",
        department: "UI/UX",
        level: "Beginner",
        accent: "blue",
        icon: "brush",
        metaIcon: "architecture",
        date: "May 20, 2026",
        time: "2:00 PM - 3:30 PM",
      },
      {
        title: "The AI UI Sprint",
        description: "Rapid prototyping and designing innovative user interfaces using AI/Stitch.",
        department: "UI/UX",
        level: "Beginner",
        accent: "green",
        icon: "neurology",
        metaIcon: "bolt",
        date: "May 22, 2026",
        time: "3:00 PM - 4:45 PM",
      },
    ],
  },
  {
    name: "Cybersecurity",
    accent: "red",
    events: [
      {
        title: "CyberForge",
        description: "Hands-on Security Lab environment exploring vulnerabilities and defenses.",
        department: "Cybersecurity",
        level: "Beginner",
        accent: "red",
        icon: "shield",
        metaIcon: "terminal",
        date: "May 25, 2026",
        time: "1:00 PM - 2:45 PM",
      },
      {
        title: "CTF Challenge",
        description: "The ultimate race to hack and win. Capture the flag in a high-stakes environment.",
        department: "Cybersecurity",
        level: "Beginner",
        accent: "red",
        icon: "lock",
        metaIcon: "military_tech",
        date: "May 27, 2026",
        time: "4:00 PM - 5:30 PM",
      },
    ],
  },
  {
    name: "Development",
    accent: "blue",
    events: [
      {
        title: "Build a Full-Stack Web App",
        description: "Build a robust end-to-end web application using React and Supabase.",
        department: "Development",
        level: "Beginner",
        accent: "blue",
        icon: "layers",
        metaIcon: "database",
        date: "May 29, 2026",
        time: "2:00 PM - 4:00 PM",
      },
      {
        title: "Build Your Own Cryptocurrency",
        description: "Exploring Web3 foundations and creating a custom token with Solidity.",
        department: "Development",
        level: "Beginner",
        accent: "green",
        icon: "code",
        metaIcon: "link",
        date: "June 1, 2026",
        time: "3:00 PM - 5:00 PM",
      },
    ],
  },
  {
    name: "Competitive Programming",
    accent: "yellow",
    events: [
      {
        title: "CP Challenge",
        description: "Master algorithms and data structures in this elite competitive programming arena.",
        department: "Competitive Programming",
        level: "Beginner",
        accent: "yellow",
        icon: "terminal",
        metaIcon: "psychology",
        date: "June 3, 2026",
        time: "1:30 PM - 3:30 PM",
      },
      {
        title: "Debug & Code Challenge",
        description: "Race against the clock to find bugs and refactor code under intense pressure.",
        department: "Competitive Programming",
        level: "Beginner",
        accent: "yellow",
        icon: "data_object",
        metaIcon: "history_edu",
        date: "June 5, 2026",
        time: "2:00 PM - 3:45 PM",
      },
    ],
  },
  {
    name: "AI/ML",
    accent: "green",
    events: [
      {
        title: "No-Code AI Automation",
        description: "Build a functional G-Mail priority classifier without writing a single line of code.",
        department: "AI/ML",
        level: "Beginner",
        accent: "yellow",
        icon: "smart_toy",
        metaIcon: "settings_input_component",
        date: "June 7, 2026",
        time: "10:00 AM - 11:45 AM",
      },
      {
        title: "Wikirace.AI",
        description: "Mastering word embeddings and semantic search through a gamified Wiki race.",
        department: "AI/ML",
        level: "Beginner",
        accent: "red",
        icon: "language",
        metaIcon: "speed",
        date: "June 9, 2026",
        time: "3:30 PM - 5:00 PM",
      },
    ],
  },
];

export const hackathons: EventCard[] = [
  {
    title: "Hackathon Event TBD",
    description:
      "Coming Soon: A high-stakes innovation challenge. Stay tuned for more details on the upcoming grand competition.",
    department: "Hackathons",
    level: "Open",
    accent: "yellow",
    icon: "military_tech",
    metaIcon: "emoji_events",
    type: "Hackathon",
    prize: "Grand Prize: TBD",
    date: "June 15, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "Hackathon Event TBD",
    description:
      "Coming Soon: A high-stakes innovation challenge. Stay tuned for more details on the upcoming grand competition.",
    department: "Hackathons",
    level: "Open",
    accent: "yellow",
    icon: "bolt",
    metaIcon: "bolt",
    type: "Hackathon",
    prize: "Prize: Tech Rewards",
    date: "June 22, 2026",
    time: "9:00 AM - 6:00 PM",
  },
];
