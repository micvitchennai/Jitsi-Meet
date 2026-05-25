import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminClient } from "@/components/AdminClient";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeEvent } from "@/lib/events";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  await connectToDatabase();
  const events = await Event.find({}).sort({ startTime: 1 });
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  const weekday = startOfWeek.getDay();
  const daysFromMonday = (weekday + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
  const totalRegistrations = await Registration.countDocuments();
  const registrationsToday = await Registration.countDocuments({ registeredAt: { $gte: startOfToday } });
  const registrationsThisWeek = await Registration.countDocuments({ registeredAt: { $gte: startOfWeek } });
  const totalUsers = await User.countDocuments();
  const hackathonEventIds = events.filter((event) => event.type === "hackathon").map((event) => event._id);
  const totalHackathonRegistrations = hackathonEventIds.length
    ? await Registration.countDocuments({ eventId: { $in: hackathonEventIds } })
    : 0;
  const registrationCountsRaw = await Registration.aggregate([
    { $group: { _id: "$eventId", count: { $sum: 1 } } },
  ]);
  const registrationCounts = registrationCountsRaw.reduce<Record<string, number>>((acc, item) => {
    acc[String(item._id)] = item.count;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdminClient
        initialEvents={events.map(serializeEvent)}
        totalRegistrations={totalRegistrations}
        registrationsToday={registrationsToday}
        registrationsThisWeek={registrationsThisWeek}
        totalUsers={totalUsers}
        totalHackathonRegistrations={totalHackathonRegistrations}
        registrationCounts={registrationCounts}
      />
    </div>
  );
}
