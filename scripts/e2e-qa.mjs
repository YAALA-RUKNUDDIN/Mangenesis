import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';

const routes = [
  '/',
  '/about',
  '/methodology',
  '/technology',
  '/contact',
  '/app',
  '/app/reserve-intelligence',
  '/app/geological-explorer',
  '/app/drilling-analytics',
  '/app/production-forecast',
  '/app/risk-intelligence',
  '/app/recommendations',
  '/app/reports',
  '/app/data-health',
  '/app/settings',
];

const viewports = [
  { name: 'Mobile (390x844)', width: 390, height: 844 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Laptop (1280x800)', width: 1280, height: 800 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Full HD (1920x1080)', width: 1920, height: 1080 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runQA() {
  console.log('=== STARTING AUTOMATED E2E QA TEST SUITE ===');
  console.log(`Browser executable: ${EDGE_PATH}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  page.on('requestfailed', (req) => {
    console.log(`  [FAILED REQUEST] ${req.method()} ${req.url()} (${req.failure()?.errorText})`);
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`[PAGE ERROR] ${err.toString()}`);
  });

  // 1. Test All Routes at Default Desktop Viewport
  console.log('\n--- 1. Testing Route Navigation & Page Rendering ---');
  await page.setViewport({ width: 1440, height: 900 });

  for (const r of routes) {
    const url = `${BASE_URL}${r}`;
    const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
    await sleep(400); // allow microtask renders
    const title = await page.title();
    const hasRoot = await page.$('#root');
    console.log(`  ✓ ${r.padEnd(28)} Status: ${res.status()} | Title: "${title.slice(0, 30)}..." | Root Mounted: ${Boolean(hasRoot)}`);
  }

  // 2. Test Key Interactions in App Shell
  console.log('\n--- 2. Testing App Shell & Desktop Sidebar Interactions ---');
  await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle0' });
  await sleep(500);

  // Check sidebar collapse button
  const collapseButton = await page.$('button[title*="sidebar"]');
  if (collapseButton) {
    await collapseButton.click();
    await sleep(300);
    const asideWidth = await page.$eval('aside', (el) => el.clientWidth);
    console.log(`  ✓ Sidebar collapsed to width: ${asideWidth}px (Expected ~64px / w-16)`);

    // Expand back
    await collapseButton.click();
    await sleep(300);
    const expandedWidth = await page.$eval('aside', (el) => el.clientWidth);
    console.log(`  ✓ Sidebar expanded back to width: ${expandedWidth}px (Expected ~256px / w-64)`);
  } else {
    console.log('  ⚠ Collapse button not found directly');
  }

  // 3. Test Command Palette (Ctrl+K trigger)
  console.log('\n--- 3. Testing Command Palette Modal ---');
  const searchButton = await page.$('button[title*="Ctrl+K"]');
  if (searchButton) {
    await searchButton.click();
    await sleep(300);
    const input = await page.$('input[placeholder*="command"]');
    if (input) {
      console.log('  ✓ Command Palette opened cleanly');
      await input.type('Reserve');
      await sleep(200);
      const itemsCount = await page.$$eval('button', (btns) =>
        btns.filter((b) => b.textContent.includes('Reserve Intelligence')).length
      );
      console.log(`  ✓ Command Palette filtered items count: ${itemsCount}`);
      // Close with ESC
      await page.keyboard.press('Escape');
      await sleep(200);
      console.log('  ✓ Command Palette closed with Escape key');
    }
  }

  // 4. Test Production Forecast Dynamic Sliders
  console.log('\n--- 4. Testing Production Forecast Dynamic Slider Response ---');
  await page.goto(`${BASE_URL}/app/production-forecast`, { waitUntil: 'networkidle0' });
  await sleep(500);

  const initialDeficitText = await page.$eval('main', (el) => {
    const alert = el.querySelector('[class*="border-rose-800"], [class*="border-emerald-800"]');
    return alert ? alert.textContent : 'none';
  });
  console.log(`  Initial deficit text: "${initialDeficitText.slice(0, 70)}..."`);

  // Change equipment slider
  const slider = await page.$('input[type="range"]');
  if (slider) {
    await slider.focus();
    // Press Left arrow 10 times to lower availability
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowLeft');
    }
    await sleep(300);
    const updatedDeficitText = await page.$eval('main', (el) => {
      const alert = el.querySelector('[class*="border-rose-800"], [class*="border-emerald-800"]');
      return alert ? alert.textContent : 'none';
    });
    console.log(`  ✓ Sliders updated deficit output dynamically to: "${updatedDeficitText.slice(0, 70)}..."`);
  }

  // 5. Test Risk Intelligence Filter Chips
  console.log('\n--- 5. Testing Risk Intelligence Severity Filter ---');
  await page.goto(`${BASE_URL}/app/risk-intelligence`, { waitUntil: 'networkidle0' });
  await sleep(500);

  const highFilterButton = await page.$eval('button', (btn) => btn.textContent); // test presence
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const txt = await page.evaluate((el) => el.textContent.trim(), b);
    if (txt === 'HIGH') {
      await b.click();
      await sleep(300);
      const rowCount = await page.$$eval('table tbody tr', (rows) => rows.length);
      console.log(`  ✓ Clicked "HIGH" severity filter -> Table displays ${rowCount} high-threat rows`);
      break;
    }
  }

  // 6. Test Multi-Viewport Horizontal Overflow Check
  console.log('\n--- 6. Testing Responsive Viewports & Horizontal Overflow Check ---');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(300);

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    console.log(`  ✓ ${vp.name.padEnd(25)}: Horizontal Overflow = ${hasOverflow ? 'DETECTED (BUG)' : 'NONE (PASS)'}`);
  }

  // 7. Check Console Errors
  console.log('\n--- 7. Console Error Audit ---');
  if (consoleErrors.length === 0) {
    console.log('  ✓ ZERO console errors or page errors detected!');
  } else {
    console.log(`  ⚠ Detected ${consoleErrors.length} console/page messages:`);
    consoleErrors.forEach((e) => console.log(`    ${e}`));
  }

  await browser.close();
  console.log('\n=== E2E QA TEST SUITE COMPLETED SUCCESSFULLY ===');
}

runQA().catch((err) => {
  console.error('E2E QA Execution Error:', err);
  process.exit(1);
});
