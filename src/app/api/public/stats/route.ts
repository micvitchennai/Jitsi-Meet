import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkApiAuth } from "@/lib/api-auth";
import User from "@/models/User";
import Registration from "@/models/Registration";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const [totalUsers, totalRegistrations, totalEvents, lastReg] = await Promise.all([
      User.countDocuments(),
      Registration.countDocuments(),
      Event.countDocuments(),
      Registration.findOne({})
        .sort({ _id: -1 })
        .select("registeredAt")
        .lean(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalRegistrations,
      totalEvents,
      lastRegistrationAt: lastReg ? lastReg.registeredAt : null,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
