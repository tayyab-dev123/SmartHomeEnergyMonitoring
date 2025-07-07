import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deviceId, timestamp, energyWatts } = await request.json();

    // Verify device belongs to user
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        userId: session.user.id,
      },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const telemetry = await prisma.telemetry.create({
      data: {
        deviceId,
        timestamp: new Date(timestamp),
        energyWatts,
      },
    });

    return NextResponse.json(telemetry);
  } catch (error) {
    console.error("Telemetry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const days = parseInt(searchParams.get("days") || "7");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause = {
      device: { userId: session.user.id },
      timestamp: { gte: startDate },
    };

    if (deviceId) {
      whereClause.deviceId = deviceId;
    }

    const telemetry = await prisma.telemetry.findMany({
      where: whereClause,
      orderBy: { timestamp: "asc" },
      include: { device: true },
    });

    return NextResponse.json(telemetry);
  } catch (error) {
    console.error("Telemetry fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
