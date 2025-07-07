const devices = [
  { id: "cmct0ms2j0001ymem27a01d9a", name: "Living Room AC" },
  { id: "cmct0ms2j0002ymemdtn2ktus", name: "Kitchen Refrigerator" },
  { id: "cmct0ms2j0003ymem1fncazwe", name: "Master Bedroom Heater" },
  { id: "cmct0ms2j0004ymemtx5bzhg8", name: "Home Office Computer" },
  { id: "cmct0ms2j0005ymemikw084bp", name: "Washing Machine" },
];

async function simulateTelemetry() {
  const baseUrl = "http://localhost:3000/api/telemetry";

  // First, you need to login to get a session token
  // This is a simplified version - in production, you'd handle auth properly

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Generate 24 hours of data at 1-minute intervals
  for (let minutes = 0; minutes < 24 * 60; minutes += 5) {
    // 5-minute intervals for faster simulation
    const timestamp = new Date(startOfToday.getTime() + minutes * 60 * 1000);

    for (const device of devices) {
      // Simulate realistic energy patterns
      let baseWatts = 0;
      const hour = timestamp.getHours();

      switch (device.name) {
        case "Living Room AC":
          // Higher usage during afternoon and evening
          baseWatts = hour >= 12 && hour <= 22 ? 1500 : 100;
          break;
        case "Kitchen Refrigerator":
          // Constant with slight variations
          baseWatts = 150;
          break;
        case "Master Bedroom Heater":
          // Higher usage at night and early morning
          baseWatts = hour >= 20 || hour <= 6 ? 1000 : 50;
          break;
        case "Home Office Computer":
          // Higher during work hours
          baseWatts = hour >= 9 && hour <= 17 ? 300 : 20;
          break;
        case "Washing Machine":
          // Occasional usage
          baseWatts =
            (hour === 10 || hour === 15) && minutes % 60 < 30 ? 2000 : 0;
          break;
      }

      // Add some random variation (±20%)
      const energyWatts = baseWatts + (Math.random() - 0.5) * baseWatts * 0.4;

      const payload = {
        deviceId: device.id,
        timestamp: timestamp.toISOString(),
        energyWatts: Math.max(0, energyWatts),
      };

      try {
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // You'll need to add proper authentication here
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error(
            `Failed to send telemetry for ${device.name}:`,
            await response.text()
          );
        }
      } catch (error) {
        console.error(`Error sending telemetry for ${device.name}:`, error);
      }
    }

    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("Telemetry simulation complete!");
}

// Note: This script needs to be run after you have:
// 1. Created a user account
// 2. Logged in to get authentication
// 3. Updated the device IDs to match your actual device IDs from the database

console.log("To run this script:");
console.log("1. First register a user and login");
console.log("2. Get the actual device IDs from your database");
console.log("3. Update the device IDs in this script");
console.log("4. Add proper authentication headers");
console.log("5. Run: node scripts/simulate-telemetry.js");
