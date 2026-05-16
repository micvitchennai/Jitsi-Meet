import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;
    const session = await getServerSession(authOptions);

    await connectToDatabase();
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let isRegistered = false;
    if (session?.user) {
      const registration = await Registration.findOne({
        eventId,
        userEmail: session.user.email,
      });
      isRegistered = !!registration;
    }

    return NextResponse.json({
      isLive: event.isLive,
      statusOverride: event.statusOverride,
      startTime: event.startTime,
      endTime: event.endTime,
      roomName: event.roomName,
      isRegistered,
      isLoggedIn: !!session?.user,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
