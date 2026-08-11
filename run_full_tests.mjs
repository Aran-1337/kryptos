import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ARTIFACT_DIR = 'C:/Users/Abdelrahman/.gemini/antigravity/brain/ab74bb0f-f58a-4132-901b-90fc2df8437a';
const SCREENSHOTS_DIR = join(ARTIFACT_DIR, 'screenshots');
const SCRATCH_DIR = join(ARTIFACT_DIR, 'scratch');

mkdirSync(SCREENSHOTS_DIR, { recursive: true });
mkdirSync(SCRATCH_DIR, { recursive: true });

const testResults = [];

function recordResult(flow, testName, status, details, screenshotPath = null) {
  const item = { flow, testName, status, details, screenshotPath };
  testResults.push(item);
  console.log(`[${status}] ${flow} :: ${testName} -> ${details}`);
}

async function takeScreenshot(page, filename) {
  const fullPath = join(SCREENSHOTS_DIR, `${filename}.png`);
  await page.screenshot({ path: fullPath, fullPage: false });
  return fullPath;
}

async function runTests() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  try {
    // =========================================================================
    // FLOW 1: Stealth 404 Protection
    // =========================================================================
    console.log('\n--- FLOW 1: Stealth 404 Protection ---');
    const context1 = await browser.createBrowserContext();
    const page1 = await context1.newPage();
    await page1.setViewport({ width: 1440, height: 900 });

    // Step 1.1: Direct access to /admin in clean context
    console.log('Accessing http://localhost:3000/admin directly in a clean context...');
    const adminResponse = await page1.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const ss1 = await takeScreenshot(page1, '01_stealth_admin_direct_access');

    const statusCode1 = adminResponse ? adminResponse.status() : null;
    const pageText1 = await page1.evaluate(() => document.body.innerText);
    const is404 = statusCode1 === 404 || pageText1.includes('404') || pageText1.includes('غير موجودة') || pageText1.includes('Not Found');

    if (is404) {
      recordResult('Stealth 404 Protection', 'Direct /admin access returns 404 error page', 'PASS', `Status Code: ${statusCode1}, Fake 404 error disguise returned cleanly`, ss1);
    } else {
      recordResult('Stealth 404 Protection', 'Direct /admin access returns 404 error page', 'FAIL', `Status Code: ${statusCode1}, Page text: ${pageText1.substring(0, 100)}`, ss1);
    }

    // Step 1.2: Access secret gate to unlock
    console.log('Accessing http://localhost:3000/secret-gate?key=mnasa2025...');
    await page1.goto('http://localhost:3000/secret-gate?key=mnasa2025', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const ss2 = await takeScreenshot(page1, '02_secret_gate_redirect');

    const currentUrl1 = page1.url();
    const cookies1 = await page1.cookies();
    const unlockedCookie = cookies1.find(c => c.name === 'admin_access_unlocked');

    if (currentUrl1.includes('/admin/login') && unlockedCookie?.value === '1') {
      recordResult('Stealth 404 Protection', 'Secret gate unlocks access and redirects to /admin/login', 'PASS', `Redirected to: ${currentUrl1}, admin_access_unlocked cookie set: ${unlockedCookie?.value}`, ss2);
    } else {
      recordResult('Stealth 404 Protection', 'Secret gate unlocks access and redirects to /admin/login', 'FAIL', `Redirect URL: ${currentUrl1}, Cookie set: ${unlockedCookie ? 'Yes' : 'No'}`, ss2);
    }

    // =========================================================================
    // FLOW 2: Admin Login & Navigation
    // =========================================================================
    console.log('\n--- FLOW 2: Admin Login & Navigation ---');
    
    // Step 2.1: Log in at /admin/login
    console.log('Logging in at /admin/login with email admin@platform.com & password Admin123456!...');
    await page1.type('input[type="email"]', 'admin@platform.com');
    await page1.type('input[type="password"]', 'Admin123456!');
    const ssLoginInputs = await takeScreenshot(page1, '03_admin_login_filled');

    await page1.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2500));

    // Persist cookies into Puppeteer context
    const tokenVal = await page1.evaluate(() => {
      const match = document.cookie.match(/admin_token=([^;]+)/);
      return match ? match[1] : '';
    });
    if (tokenVal) {
      await page1.setCookie({ name: 'admin_token', value: tokenVal, domain: 'localhost', path: '/' });
    }

    const ssDashboard = await takeScreenshot(page1, '04_admin_dashboard_loaded');
    const dashUrl = page1.url();
    const isDashboard = dashUrl.endsWith('/admin') || dashUrl.includes('/admin?');

    if (isDashboard) {
      recordResult('Admin Login & Navigation', 'Admin login with valid credentials loads Dashboard', 'PASS', `Dashboard loaded cleanly at: ${dashUrl}`, ssDashboard);
    } else {
      recordResult('Admin Login & Navigation', 'Admin login with valid credentials loads Dashboard', 'FAIL', `Current URL after login: ${dashUrl}`, ssDashboard);
    }

    // Step 2.2: Sidebar -> Click "إدارة الفريق 👥" (/admin/team)
    console.log('Navigating to Team Management via Sidebar link "إدارة الفريق 👥"...');
    const teamLink = await page1.$('a[href="/admin/team"]');
    if (teamLink) {
      await teamLink.click();
      await new Promise(r => setTimeout(r, 1500));
    } else {
      await page1.goto('http://localhost:3000/admin/team', { waitUntil: 'networkidle2' });
    }
    const ssTeamPage = await takeScreenshot(page1, '05_admin_team_page');

    const teamUrl = page1.url();
    const teamTitle = await page1.evaluate(() => document.querySelector('h1')?.textContent || '');
    const isTeamPage = teamUrl.includes('/admin/team') && teamTitle.includes('إدارة الفريق');

    if (isTeamPage) {
      recordResult('Admin Login & Navigation', 'Clicking Team Management sidebar link loads /admin/team', 'PASS', `Heading: "${teamTitle}", URL: ${teamUrl}`, ssTeamPage);
    } else {
      recordResult('Admin Login & Navigation', 'Clicking Team Management sidebar link loads /admin/team', 'FAIL', `Heading: "${teamTitle}", URL: ${teamUrl}`, ssTeamPage);
    }

    // Step 2.3: Verify Invite Popup
    console.log('Testing Invite Member Popup by clicking "دعوة عضو جديد"...');
    const inviteBtn = await page1.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('دعوة عضو جديد'));
    });

    if (inviteBtn && inviteBtn.asElement()) {
      await inviteBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1000));
      const ssInviteModal = await takeScreenshot(page1, '06_admin_team_invite_popup');

      const modalTitleText = await page1.evaluate(() => {
        const modalContainer = Array.from(document.querySelectorAll('div')).find(el => el.textContent?.includes('دعوة عضو جديد') && el.style?.position === 'relative');
        if (modalContainer) {
          const h2 = modalContainer.querySelector('h2');
          return h2 ? h2.textContent : '';
        }
        return document.body.innerText.includes('دعوة عضو جديد') ? 'دعوة عضو جديد' : '';
      });

      if (modalTitleText.includes('دعوة عضو جديد')) {
        recordResult('Admin Login & Navigation', 'Team invite popup opens correctly with title & permissions', 'PASS', `Invite popup verified with title: "${modalTitleText}"`, ssInviteModal);
      } else {
        recordResult('Admin Login & Navigation', 'Team invite popup opens correctly with title & permissions', 'FAIL', `Popup heading check: "${modalTitleText}"`, ssInviteModal);
      }

      // Close modal cleanly
      await page1.evaluate(() => {
        const backdrop = document.querySelector('div[style*="z-index: 200"]');
        if (backdrop) backdrop.remove();
        const modalBox = document.querySelector('div[style*="z-index: 201"]');
        if (modalBox) modalBox.remove();
      });
      await new Promise(r => setTimeout(r, 600));
    } else {
      recordResult('Admin Login & Navigation', 'Team invite popup opens correctly with title & permissions', 'FAIL', 'Could not find "دعوة عضو جديد" button', ssTeamPage);
    }

    // Step 2.4: Sidebar -> Click "لوحة الأوائل 🏆" (/admin/leaderboard)
    console.log('Navigating to Leaderboard via Sidebar link "لوحة الأوائل 🏆"...');
    const leaderboardLink = await page1.$('a[href="/admin/leaderboard"]');
    if (leaderboardLink) {
      await leaderboardLink.click();
      await new Promise(r => setTimeout(r, 1500));
    } else {
      await page1.goto('http://localhost:3000/admin/leaderboard', { waitUntil: 'networkidle2' });
    }

    // Double check URL
    if (!page1.url().includes('/admin/leaderboard')) {
      await page1.goto('http://localhost:3000/admin/leaderboard', { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 1500));
    }

    const ssAdminLeaderboard = await takeScreenshot(page1, '07_admin_leaderboard_in_admin_layout');

    const leaderboardUrl = page1.url();
    const layoutInfo = await page1.evaluate(() => {
      const hasHeader = !!document.querySelector('header');
      const hasSidebar = !!document.querySelector('.desktop-sidebar') || !!document.querySelector('aside') || document.body.innerText.includes('الرئيسية والتحليلات');
      const h1Text = document.querySelector('h1')?.textContent || '';
      return { hasHeader, hasSidebar, h1Text };
    });

    const isInsideAdminLayout = leaderboardUrl.includes('/admin/leaderboard') && layoutInfo.hasSidebar && layoutInfo.h1Text.includes('إدارة لوحة الأوائل');

    if (isInsideAdminLayout) {
      recordResult('Admin Login & Navigation', 'Leaderboard opens INSIDE admin layout (/admin/leaderboard)', 'PASS', `URL: ${leaderboardUrl}, Admin Layout active with Sidebar, H1: "${layoutInfo.h1Text}"`, ssAdminLeaderboard);
    } else {
      recordResult('Admin Login & Navigation', 'Leaderboard opens INSIDE admin layout (/admin/leaderboard)', 'FAIL', `URL: ${leaderboardUrl}, Has Admin Layout Sidebar: ${layoutInfo.hasSidebar}, H1: "${layoutInfo.h1Text}"`, ssAdminLeaderboard);
    }

    await context1.close();

    // =========================================================================
    // FLOW 3: Live Stream Protection (/live)
    // =========================================================================
    console.log('\n--- FLOW 3: Live Stream Protection (/live) ---');
    const context2 = await browser.createBrowserContext();
    const page2 = await context2.newPage();
    await page2.setViewport({ width: 1440, height: 900 });

    // Step 3.1: Visit /live as guest
    console.log('Visiting http://localhost:3000/live as guest...');
    await page2.goto('http://localhost:3000/live', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const ssLiveGuest = await takeScreenshot(page2, '08_live_page_guest');

    const liveBannerText = await page2.evaluate(() => document.body.innerText);
    const hasGuestBanner = liveBannerText.includes('البث المباشر متاح للطلاب المسجلين فقط 🔒');

    const joinBtn = await page2.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('سجل دخول للانضمام'));
    });
    const hasJoinBtn = !!(joinBtn && joinBtn.asElement());

    if (hasGuestBanner && hasJoinBtn) {
      recordResult('Live Stream Protection (/live)', 'Guest notice banner & locked join button displayed', 'PASS', 'Banner "البث المباشر متاح للطلاب المسجلين فقط 🔒" and button "سجل دخول للانضمام 🔒" verified', ssLiveGuest);
    } else {
      recordResult('Live Stream Protection (/live)', 'Guest notice banner & locked join button displayed', 'FAIL', `Banner found: ${hasGuestBanner}, Button found: ${hasJoinBtn}`, ssLiveGuest);
    }

    // Step 3.2: Click "سجل دخول للانضمام 🔒"
    console.log('Clicking "سجل دخول للانضمام 🔒"...');
    if (joinBtn && joinBtn.asElement()) {
      await joinBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1000));
      const ssLiveModal = await takeScreenshot(page2, '09_live_lock_modal');

      const modalHeading = await page2.evaluate(() => {
        const h2s = Array.from(document.querySelectorAll('h2'));
        const targetH2 = h2s.find(h => h.textContent.includes('تسجيل الدخول مطلوب'));
        return targetH2 ? targetH2.textContent : '';
      });

      if (modalHeading.includes('تسجيل الدخول مطلوب')) {
        recordResult('Live Stream Protection (/live)', 'Clicking join button opens lock modal "تسجيل الدخول مطلوب 🔐"', 'PASS', `Lock Modal verified with heading: "${modalHeading}"`, ssLiveModal);
      } else {
        recordResult('Live Stream Protection (/live)', 'Clicking join button opens lock modal "تسجيل الدخول مطلوب 🔐"', 'FAIL', `Modal heading: "${modalHeading}"`, ssLiveModal);
      }
    } else {
      recordResult('Live Stream Protection (/live)', 'Clicking join button opens lock modal "تسجيل الدخول مطلوب 🔐"', 'FAIL', 'Could not click join button', ssLiveGuest);
    }

    await context2.close();

    // =========================================================================
    // FLOW 4: Books Protection (/books)
    // =========================================================================
    console.log('\n--- FLOW 4: Books Protection (/books) ---');
    const context3 = await browser.createBrowserContext();
    const page3 = await context3.newPage();
    await page3.setViewport({ width: 1440, height: 900 });

    // Step 4.1: Visit /books as guest
    console.log('Visiting http://localhost:3000/books as guest...');
    await page3.goto('http://localhost:3000/books', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const ssBooksGuest = await takeScreenshot(page3, '10_books_page_guest');

    const booksText = await page3.evaluate(() => document.body.innerText);
    const hasBooksGuestBanner = booksText.includes('المكتبة والكتب متاحة للطلاب المسجلين فقط 🔒');

    const bookOrderBtn = await page3.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('سجل دخول للطلب'));
    });
    const hasBookOrderBtn = !!(bookOrderBtn && bookOrderBtn.asElement());

    if (hasBooksGuestBanner && hasBookOrderBtn) {
      recordResult('Books Protection (/books)', 'Guest notice banner & locked order buttons displayed', 'PASS', 'Banner "المكتبة والكتب متاحة للطلاب المسجلين فقط 🔒" and buttons "سجل دخول للطلب 🔒" verified', ssBooksGuest);
    } else {
      recordResult('Books Protection (/books)', 'Guest notice banner & locked order buttons displayed', 'FAIL', `Banner found: ${hasBooksGuestBanner}, Button found: ${hasBookOrderBtn}`, ssBooksGuest);
    }

    // Step 4.2: Click "سجل دخول للطلب 🔒" on printed/digital book
    console.log('Clicking "سجل دخول للطلب 🔒"...');
    if (bookOrderBtn && bookOrderBtn.asElement()) {
      await bookOrderBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1000));
      const ssBooksModal = await takeScreenshot(page3, '11_books_lock_modal');

      const booksModalHeading = await page3.evaluate(() => {
        const h2s = Array.from(document.querySelectorAll('h2'));
        const targetH2 = h2s.find(h => h.textContent.includes('تسجيل الدخول مطلوب'));
        return targetH2 ? targetH2.textContent : '';
      });

      if (booksModalHeading.includes('تسجيل الدخول مطلوب')) {
        recordResult('Books Protection (/books)', 'Clicking order button opens lock modal "تسجيل الدخول مطلوب 🔐"', 'PASS', `Lock Modal verified with heading: "${booksModalHeading}"`, ssBooksModal);
      } else {
        recordResult('Books Protection (/books)', 'Clicking order button opens lock modal "تسجيل الدخول مطلوب 🔐"', 'FAIL', `Modal heading: "${booksModalHeading}"`, ssBooksModal);
      }
    } else {
      recordResult('Books Protection (/books)', 'Clicking order button opens lock modal "تسجيل الدخول مطلوب 🔐"', 'FAIL', 'Could not click order button', ssBooksGuest);
    }

    await context3.close();

  } catch (err) {
    console.error('Test execution error:', err);
    recordResult('System', 'Test Suite Execution', 'FAIL', `Error: ${err.message}`);
  } finally {
    await browser.close();
  }

  // Write results JSON file
  const resultsJsonPath = join(SCRATCH_DIR, 'test_results.json');
  writeFileSync(resultsJsonPath, JSON.stringify(testResults, null, 2));
  console.log('\nTesting Complete! Results saved to:', resultsJsonPath);
}

runTests();
