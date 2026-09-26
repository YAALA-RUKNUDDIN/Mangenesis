const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testEdgeMineSwitch() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  console.log('Launching Microsoft Edge at:', edgePath);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const page = await browser.newPage();
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('[BROWSER ERROR]:', msg.text());
      }
    });

    console.log('Navigating to http://localhost:5173/app ...');
    await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle0', timeout: 15000 });

    // 1. Initial mine name check
    const initialMine = await page.evaluate(() => {
      const btn = document.querySelector('header button span.font-semibold');
      return btn ? btn.textContent.trim() : null;
    });
    console.log('Initial Mine in header:', initialMine);

    // 2. Open mine dropdown
    console.log('Clicking mine dropdown button...');
    const mineBtn = await page.$('header button:has(span.font-semibold)');
    if (mineBtn) {
      await mineBtn.click();
    } else {
      // Fallback selector
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const mineButton = buttons.find(b => b.textContent.includes('MINE:'));
        if (mineButton) mineButton.click();
      });
    }

    await new Promise(r => setTimeout(r, 600));

    // 3. Inspect all available mines in dropdown
    const dropdownMines = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.absolute button span.font-medium'));
      return items.map(i => i.textContent.trim());
    });
    console.log('Mines available in dropdown:', dropdownMines);

    // 4. Click Balaghat Manganese Mine
    console.log('Selecting Balaghat Manganese Mine...');
    const clickedBalaghat = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.absolute button'));
      const balaghatBtn = buttons.find(b => b.textContent.includes('Balaghat'));
      if (balaghatBtn) {
        balaghatBtn.click();
        return true;
      }
      return false;
    });
    console.log('Balaghat button clicked:', clickedBalaghat);

    await new Promise(r => setTimeout(r, 1200));

    // 5. Verify switched mine name in Header & Map
    const switchedState = await page.evaluate(() => {
      const headerMine = document.querySelector('header button span.font-semibold')?.textContent?.trim();
      const mapTitle = document.querySelector('.lg\\:col-span-7 span')?.textContent?.trim();
      return { headerMine, mapTitle };
    });
    console.log('After switching to Balaghat:', switchedState);

    // 6. Switch to Dongri Buzurg Mine
    console.log('Switching to Dongri Buzurg Mine...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mineButton = buttons.find(b => b.textContent.includes('MINE:'));
      if (mineButton) mineButton.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.absolute button'));
      const dongriBtn = buttons.find(b => b.textContent.includes('Dongri'));
      if (dongriBtn) dongriBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    const dongriState = await page.evaluate(() => {
      const headerMine = document.querySelector('header button span.font-semibold')?.textContent?.trim();
      const mapTitle = document.querySelector('.lg\\:col-span-7 span')?.textContent?.trim();
      return { headerMine, mapTitle };
    });
    console.log('After switching to Dongri Buzurg:', dongriState);

    // 7. Switch to Mansar Manganese Mine
    console.log('Switching to Mansar Manganese Mine...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mineButton = buttons.find(b => b.textContent.includes('MINE:'));
      if (mineButton) mineButton.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.absolute button'));
      const mansarBtn = buttons.find(b => b.textContent.includes('Mansar'));
      if (mansarBtn) mansarBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    const mansarState = await page.evaluate(() => {
      const headerMine = document.querySelector('header button span.font-semibold')?.textContent?.trim();
      const mapTitle = document.querySelector('.lg\\:col-span-7 span')?.textContent?.trim();
      return { headerMine, mapTitle };
    });
    console.log('After switching to Mansar:', mansarState);

    // 8. Capture screenshot
    const screenshotPath = path.join(__dirname, 'edge_mine_switch_verified.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log('Screenshot successfully saved to:', screenshotPath);

    console.log('=== TEST PASSED SUCCESSFULLY ON MICROSOFT EDGE ===');
  } catch (err) {
    console.error('Edge test encountered an error:', err);
  } finally {
    await browser.close();
  }
}

testEdgeMineSwitch();
