const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const watchDir = path.resolve(process.env.HOME, "Code/nexus-system/CanonLogs");
const mergeScript = path.resolve(process.env.HOME, "Code/nexus-system/hooks/memoryMerge.js");
const inventoryShortcut = path.resolve(process.env.HOME, ".nexus/shortcuts/TaskInventory.command");

console.log("🔁 Watching CanonLogs for KickOut threads...");

fs.watch(watchDir, (eventType, filename) => {
  if (!filename || !filename.endsWith(".json")) return;

  const filePath = path.join(watchDir, filename);
  console.log(`📥 Detected file change: ${filename}`);

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    if (data.KickOutThread === true) {
      console.log("🚨 KickOutThread flag detected — syncing memory...");

      exec(`node "${mergeScript}"`, (err, stdout, stderr) => {
        if (err) {
          console.error("❌ Memory merge failed:", stderr.trim());
          return;
        }

        console.log(stdout.trim());
        exec(`open -a Terminal "${inventoryShortcut}"`);
      });
    }
  } catch (e) {
    console.warn("⚠️ Could not read or parse JSON:", e.message);
  }
});
