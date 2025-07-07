import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 10);

  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      password: hashedPassword,
      name: "Demo User",
    },
  });

  console.log("Created demo user:", user.email);

  // Create devices for demo user
  const devices = await prisma.device.createMany({
    data: [
      { name: "Living Room AC", type: "AC", userId: user.id },
      { name: "Kitchen Refrigerator", type: "Refrigerator", userId: user.id },
      { name: "Master Bedroom Heater", type: "Heater", userId: user.id },
      { name: "Home Office Computer", type: "Computer", userId: user.id },
      { name: "Washing Machine", type: "Appliance", userId: user.id },
    ],
  });

  console.log("Created", devices.count, "devices");

  // Get created devices
  const createdDevices = await prisma.device.findMany({
    where: { userId: user.id },
  });

  // Generate sample telemetry data for the last 7 days
  const now = new Date();
  const telemetryData = [];

  for (const device of createdDevices) {
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour += 4) {
        // Every 4 hours for sample data
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

  console.log("Created", telemetryData.length, "telemetry records");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
