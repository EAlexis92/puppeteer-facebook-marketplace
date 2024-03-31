import puppeteer from "puppeteer-core";
import * as edgePaths from "edge-paths";

const EDGE_PATH = edgePaths.getEdgePath();

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe",
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.facebook.com");
  await new Promise((r) => setTimeout(r, 100000));
  await browser.close();
})();
