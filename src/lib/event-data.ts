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
