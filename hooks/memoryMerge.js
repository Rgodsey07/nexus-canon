// memoryMerge.js
const fs = require("fs");
const path = require("path");

const logDir = path.resolve(process.env.HOME, "CanonLogs");
const patchDir = path.resolve(process.env.HOME, "Code/nexus-system/MemoryPatches");

function mergeLogs() {
  if (!fs.existsSync(logDir)) {
    console.error("❌ Log directory not found:", logDir);
    return;
  }

  const logs = fs.readdirSync(logDir).filter(f => f.endsWith(".log"));
  const result = {};

  logs.forEach(logFile => {
    const filePath = path.join(logDir, logFile);
    const content = fs.readFileSync(filePath, "utf-8");
    result[logFile] = content;
  });

  if (!fs.existsSync(patchDir)) {
    fs.mkdirSync(patchDir, { recursive: true });
  }

  const outFile = path.join(
    patchDir,
    `MergedLog_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.json`
  );

  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log(`✅ Merged ${logs.length} logs → ${outFile}`);
}

mergeLogs();
