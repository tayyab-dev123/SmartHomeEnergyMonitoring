import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const devices = await prisma.device.findMany({
      where: { userId: session.user.id },
      include: {
        telemetry: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Devices fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type } = await request.json();

    const device = await prisma.device.create({
      data: {
        name,
        type,
        userId: session.user.id,
      },
    });

    return NextResponse.json(device);
  } catch (error) {
    console.error("Device creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
