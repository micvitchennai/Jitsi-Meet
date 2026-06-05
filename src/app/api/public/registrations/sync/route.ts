import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { checkApiAuth } from "@/lib/api-auth";
import Registration from "@/models/Registration";
import User from "@/models/User";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Authenticate Request
  if (!checkApiAuth(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Connect to Database
    await connectToDatabase();

    // 3. Parse and Validate Query Parameters
    const { searchParams } = new URL(request.url);
    const afterId = searchParams.get("afterId");

    const filter: any = {};
    if (afterId) {
      if (!mongoose.Types.ObjectId.isValid(afterId)) {
        return NextResponse.json({ message: "Invalid afterId parameter" }, { status: 400 });
      }
      filter._id = { $gt: new mongoose.Types.ObjectId(afterId) };
    }

    // 4. Query Registrations with Populate and Lean
    const registrations = await Registration.find(filter)
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "eventId",
        select: "title domain type startTime endTime roomName isLive isPublished",
      })
      .sort({ _id: 1 })
      .limit(500)
      .lean();

    // 5. Transform/Flatten Response Data
    const data = registrations.map((r: any) => {
      const user = r.userId || {};
      const event = r.eventId || {};
      return {
        registrationId: r._id.toString(),
        registeredAt: r.registeredAt,
        name: user.name || null,
        email: user.email || null,
        mobileNumber: r.mobileNumber || null,
        mobileCountry: r.mobileCountry || null,
        registrationNumber: r.registrationNumber || null,
        schoolCollegeName: r.schoolCollegeName || null,
        institutionType: r.institutionType || null,
        year: r.year || null,
        grade: r.grade || null,
        eventId: event._id ? event._id.toString() : null,
        eventTitle: event.title || null,
        domain: event.domain || null,
        eventType: event.type || null,
        roomName: event.roomName || null,
        startTime: event.startTime || null,
        endTime: event.endTime || null,
        isLive: event.isLive ?? null,
        isPublished: event.isPublished ?? null,
      };
    });

    const count = data.length;
    const lastId = count > 0 ? data[count - 1].registrationId : afterId || null;

    return NextResponse.json({
      count,
      lastId,
      data,
    });
  } catch (error: any) {
    console.error("Error syncing registrations:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
