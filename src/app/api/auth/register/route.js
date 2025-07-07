import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Create default devices for demo
    await prisma.device.createMany({
      data: [
        { name: "Living Room AC", type: "AC", userId: user.id },
        { name: "Kitchen Refrigerator", type: "Refrigerator", userId: user.id },
        { name: "Master Bedroom Heater", type: "Heater", userId: user.id },
        { name: "Home Office Computer", type: "Computer", userId: user.id },
        { name: "Washing Machine", type: "Appliance", userId: user.id },
      ],
    });

    // Get created devices
    const createdDevices = await prisma.device.findMany({
      where: { userId: user.id },
    });

    // Generate random telemetry data for the last 7 days
    const now = new Date();
    const telemetryData = [];

    for (const device of createdDevices) {
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour += 4) {
          const timestamp = new Date(now);
          timestamp.setDate(timestamp.getDate() - day);
          timestamp.setHours(hour, 0, 0, 0);

          let baseWatts = 0;
          switch (device.type) {
            case "AC":
              baseWatts = hour >= 12 && hour <= 22 ? 1500 : 100;
              break;
            case "Refrigerator":
              baseWatts = 150;
              break;
            case "Heater":
              baseWatts = hour >= 20 || hour <= 6 ? 1000 : 50;
              break;
            case "Computer":
              baseWatts = hour >= 9 && hour <= 17 ? 300 : 20;
              break;
            case "Appliance":
              baseWatts = hour === 10 || hour === 15 ? 2000 : 0;
              break;
          }

          telemetryData.push({
            deviceId: device.id,
            timestamp,
            energyWatts: baseWatts + (Math.random() - 0.5) * baseWatts * 0.2,
          });
        }
      }
    }

    await prisma.telemetry.createMany({
      data: telemetryData,
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
