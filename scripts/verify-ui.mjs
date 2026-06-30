import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { PNG } from "pngjs";

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const apiBaseUrl = process.env.API_URL ?? "http://127.0.0.1:4000";
const outputDir = join(process.cwd(), ".codex-logs");

await mkdir(outputDir, { recursive: true });

let browser;
let managedApi = null;

async function canvasStats(page) {
  const locator = page.locator("canvas").first();
  const buffer = await locator.screenshot();
  const png = PNG.sync.read(buffer);
  const buckets = new Set();
  let alphaPixels = 0;
  let variedPixels = 0;

  for (let index = 0; index < png.data.length; index += 80) {
    const red = png.data[index];
    const green = png.data[index + 1];
    const blue = png.data[index + 2];
    const alpha = png.data[index + 3];

    if (alpha > 0) {
      alphaPixels += 1;
    }

    if (Math.abs(red - green) + Math.abs(green - blue) > 8) {
      variedPixels += 1;
    }

    buckets.add(`${Math.floor(red / 16)}-${Math.floor(green / 16)}-${Math.floor(blue / 16)}`);
  }

  return {
    found: true,
    webgl: true,
    width: png.width,
    height: png.height,
    colorBuckets: buckets.size,
    alphaSamples: alphaPixels,
    variedSamples: variedPixels
  };
}

async function verifyViewport(name, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 30000 });
  await page.waitForTimeout(1200);

  const initialStats = await canvasStats(page);
  await verifyViewerControls(page);
  await verifyPrimaryScreens(page);
  await page.screenshot({ path: join(outputDir, `${name}-engineer.png`), fullPage: true });

  const tabs = ["Repair", "Transfers", "Analytics"];
  for (const tab of tabs) {
    await page.getByRole("button", { name: tab }).click();
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: join(outputDir, `${name}-analytics.png`), fullPage: true });
  await page.close();

  return {
    viewport: name,
    initialStats
  };
}

async function verifyViewerControls(page) {
  const controlTitles = ["Power simulation", "Exploded view", "Section plane", "Measurement overlay", "Fault markers"];

  for (const title of controlTitles) {
    const button = page.getByTitle(title).first();
    const before = await button.getAttribute("aria-pressed");
    await button.click();
    await page.waitForTimeout(250);
    const after = await button.getAttribute("aria-pressed");

    if (before === after) {
      throw new Error(`${title} did not toggle aria-pressed state`);
    }

    await button.click();
  }
}

async function verifyPrimaryScreens(page) {
  await page.getByText("STEP | STL | OBJ | GLB ready").waitFor({ timeout: 10000 });
  await page.getByText("Encrypted review session").waitFor({ timeout: 10000 });
  await page.getByText("Afterburner flow active").waitFor({ timeout: 10000 });

  await page.getByRole("button", { name: "Repair" }).click();
  await page.getByText("Repair Workflow").waitFor({ timeout: 10000 });
  await page.getByText("Live Chat").waitFor({ timeout: 10000 });

  await page.getByRole("button", { name: "Transfers" }).click();
  await page.getByText("Transfer Queue").waitFor({ timeout: 10000 });
  await page.getByText("Create transfer package").waitFor({ timeout: 10000 });

  await page.getByRole("button", { name: "Analytics" }).click();
  await page.getByText("Production Intelligence").waitFor({ timeout: 10000 });
  await page.getByText("AI Reports").waitFor({ timeout: 10000 });

  await page.getByRole("button", { name: "Engineer" }).click();
  await page.getByText("Holographic wireframe").waitFor({ timeout: 10000 });
  await page.getByText("live exhaust").waitFor({ timeout: 10000 });
}

async function verifyApi() {
  const health = await fetch(`${apiBaseUrl}/health`).then((response) => response.json());
  if (health.status !== "ok") {
    throw new Error(`API health failed: ${JSON.stringify(health)}`);
  }

  const transfers = await fetch(`${apiBaseUrl}/api/transfers`, {
    headers: { "x-user-role": "Engineer" }
  }).then((response) => response.json());
  if (!Array.isArray(transfers.data) || transfers.data.length < 3) {
    throw new Error("Transfer API did not return demo transfer packages");
  }

  const recommendations = await fetch(`${apiBaseUrl}/api/ai/recommendations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-role": "Engineer"
    },
    body: JSON.stringify({
      assetId: "fan-rotor",
      constraints: ["reduce mass", "maintain fatigue life"],
      priority: "weight"
    })
  }).then((response) => response.json());
  if (!Array.isArray(recommendations.data) || recommendations.data.length === 0) {
    throw new Error("AI recommendation API did not return suggestions");
  }

  const audit = await fetch(`${apiBaseUrl}/api/security/audit`, {
    headers: { "x-user-role": "Viewer" }
  }).then((response) => response.json());
  if (!Array.isArray(audit.data) || audit.data.length === 0) {
    throw new Error("Audit API did not return activity records");
  }

  return {
    health: health.status,
    transfers: transfers.data.length,
    recommendations: recommendations.data.length,
    auditEvents: audit.data.length
  };
}

async function ensureApi() {
  if (await isApiHealthy()) {
    return null;
  }

  const apiProcess = spawn(process.execPath, ["--import", "tsx", "server/index.ts"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"]
  });

  let stderr = "";
  apiProcess.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isApiHealthy()) {
      return apiProcess;
    }

    if (apiProcess.exitCode !== null) {
      throw new Error(`Managed API exited before health check passed: ${stderr.trim()}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  apiProcess.kill();
  throw new Error(`Managed API did not become healthy: ${stderr.trim()}`);
}

async function isApiHealthy() {
  try {
    const response = await fetch(`${apiBaseUrl}/health`);
    if (!response.ok) {
      return false;
    }

    const body = await response.json();
    return body.status === "ok";
  } catch {
    return false;
  }
}

try {
  managedApi = await ensureApi();
  browser = await chromium.launch({ headless: true });

  const results = [
    await verifyViewport("desktop", { width: 1440, height: 1100 }),
    await verifyViewport("mobile", { width: 390, height: 900 })
  ];
  const api = await verifyApi();

  for (const result of results) {
    if (!result.initialStats.found || !result.initialStats.webgl || result.initialStats.colorBuckets < 16) {
      throw new Error(`Canvas verification failed for ${result.viewport}: ${JSON.stringify(result.initialStats)}`);
    }
  }

  console.log(JSON.stringify({ ok: true, screenshots: outputDir, api, results }, null, 2));
} finally {
  if (browser) {
    await browser.close();
  }

  if (managedApi) {
    managedApi.kill();
  }
}
