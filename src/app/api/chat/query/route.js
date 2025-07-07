import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import openai from "@/lib/openai";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await request.json();

    // Get user's devices
    const devices = await prisma.device.findMany({
      where: { userId: session.user.id },
    });

    // Parse the question to extract intent
    const systemPrompt = `You are a smart home energy assistant. Analyze the user's question about their energy consumption and return a JSON response with:
    1. "intent": The type of query (e.g., "device_usage", "comparison", "total_usage", "highest_consumer")
    2. "timeframe": The time period mentioned (e.g., "today", "yesterday", "last_week", "last_month")
    3. "deviceName": The specific device mentioned (if any)
    4. "deviceType": The type of device mentioned (if any)
    
    User has these devices: ${devices
      .map((d) => `${d.name} (${d.type})`)
      .join(", ")}
    
    Return only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.3,
    });

    const parsedIntent = JSON.parse(completion.choices[0].message.content);

    // Calculate timeframe
    const now = new Date();
    let startDate = new Date();

    switch (parsedIntent.timeframe) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        now.setDate(now.getDate() - 1);
        now.setHours(23, 59, 59, 999);
        break;
      case "last_week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "last_month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7); // Default to last week
    }

    // Build query based on intent
    let whereClause = {
      device: { userId: session.user.id },
      timestamp: {
        gte: startDate,
        lte: now,
      },
    };

    // If specific device mentioned, filter by it
    if (parsedIntent.deviceName || parsedIntent.deviceType) {
      const deviceFilter = {};
      if (parsedIntent.deviceName) {
        const device = devices.find((d) =>
          d.name.toLowerCase().includes(parsedIntent.deviceName.toLowerCase())
        );
        if (device) {
          whereClause.deviceId = device.id;
        }
      } else if (parsedIntent.deviceType) {
        const deviceIds = devices
          .filter(
            (d) =>
              d.type.toLowerCase() === parsedIntent.deviceType.toLowerCase()
          )
          .map((d) => d.id);
        if (deviceIds.length > 0) {
          whereClause.deviceId = { in: deviceIds };
        }
      }
    }

    // Fetch telemetry data
    const telemetryData = await prisma.telemetry.findMany({
      where: whereClause,
      include: { device: true },
      orderBy: { timestamp: "asc" },
    });

    // Process data based on intent
    let response = {
      summary: "",
      data: [],
      totalUsage: 0,
      deviceBreakdown: {},
    };

    if (telemetryData.length === 0) {
      response.summary =
        "No energy usage data found for the specified timeframe.";
    } else {
      // Calculate total usage and device breakdown
      telemetryData.forEach((reading) => {
        response.totalUsage += reading.energyWatts;
        if (!response.deviceBreakdown[reading.device.name]) {
          response.deviceBreakdown[reading.device.name] = 0;
        }
        response.deviceBreakdown[reading.device.name] += reading.energyWatts;
      });

      // Convert to kWh (assuming readings are in watts per minute)
      response.totalUsage = (response.totalUsage / 60 / 1000).toFixed(2);
      Object.keys(response.deviceBreakdown).forEach((device) => {
        response.deviceBreakdown[device] = (
          response.deviceBreakdown[device] /
          60 /
          1000
        ).toFixed(2);
      });

      // Generate summary based on intent
      switch (parsedIntent.intent) {
        case "device_usage":
          const deviceName = Object.keys(response.deviceBreakdown)[0];
          response.summary = `${deviceName} used ${
            response.deviceBreakdown[deviceName]
          } kWh ${parsedIntent.timeframe.replace("_", " ")}.`;
          break;
        case "highest_consumer":
          const highest = Object.entries(response.deviceBreakdown).sort(
            ([, a], [, b]) => b - a
          )[0];
          response.summary = `Your highest consuming device ${parsedIntent.timeframe.replace(
            "_",
            " "
          )} was ${highest[0]} with ${highest[1]} kWh.`;
          break;
        case "total_usage":
          response.summary = `Your total energy consumption ${parsedIntent.timeframe.replace(
            "_",
            " "
          )} was ${response.totalUsage} kWh.`;
          break;
        case "comparison":
          response.summary = `Energy usage breakdown ${parsedIntent.timeframe.replace(
            "_",
            " "
          )}: ${Object.entries(response.deviceBreakdown)
            .map(([device, usage]) => `${device}: ${usage} kWh`)
            .join(", ")}`;
          break;
        default:
          response.summary = `Total energy usage ${parsedIntent.timeframe.replace(
            "_",
            " "
          )}: ${response.totalUsage} kWh`;
      }

      // Include time series data for charts
      response.data = telemetryData.map((reading) => ({
        timestamp: reading.timestamp,
        device: reading.device.name,
        energyWatts: reading.energyWatts,
      }));
    }

    // Save query to database
    await prisma.query.create({
      data: {
        userId: session.user.id,
        question,
        response: response,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat query error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
