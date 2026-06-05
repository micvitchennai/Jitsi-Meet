import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkApiAuth } from "@/lib/api-auth";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const events = await Event.find({})
      .select("title description domain type startTime endTime roomName isLive isPublished")
      .lean();

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
