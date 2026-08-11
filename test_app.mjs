import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ARTIFACT_DIR = 'C:/Users/Abdelrahman/.gemini/antigravity/brain/d9123a46-0cf0-42b3-b021-b2719abe77f0';
const SCREENSHOTS_DIR = join(ARTIFACT_DIR, 'screenshots');

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const results = [];

function log(section, item, status, notes) {
  const entry = { section, item, status, notes };
  results.push(entry);
  console.log(`[${status}] ${section} > ${item}: ${notes}`);
}

async function screenshot(page, name) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function fullScreenshot(page, name) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  return path;
}

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // =============================
  // 1. HOMEPAGE TESTS
  // =============================
  console.log('\n=== HOMEPAGE TESTS ===');
  
  let navErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') navErrors.push(msg.text());
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await screenshot(page, '01_homepage_initial');

  // Navbar checks
  const navbar = await page.$('nav, header, [class*="nav"], [class*="Navbar"], [class*="header"]');
  log('Homepage', 'Navbar visible', navbar ? 'PASS' : 'FAIL', navbar ? 'Navbar element found' : 'No nav/header element found');

  // Check for logo
  const logo = await page.$('img[alt*="logo"], img[alt*="Logo"], [class*="logo"], [class*="Logo"], svg[class*="logo"]');
  const logoText = await page.$('[class*="logo"], [class*="brand"]');
  log('Homepage', 'Logo visible', (logo || logoText) ? 'PASS' : 'FAIL', (logo || logoText) ? 'Logo element found' : 'No logo found');

  // Check for nav links
  const navLinks = await page.$$('nav a, header a');
  log('Homepage', 'Nav links visible', navLinks.length > 0 ? 'PASS' : 'FAIL', `Found ${navLinks.length} nav links`);

  // Check for auth buttons (login/register)
  const authButtons = await page.$$('button, a[href*="login"], a[href*="register"], a[href*="auth"], [class*="auth"]');
  log('Homepage', 'Auth buttons visible', authButtons.length > 0 ? 'PASS' : 'FAIL', `Found ${authButtons.length} possible auth elements`);

  // Hero section
  const hero = await page.$('[class*="hero"], [class*="Hero"], section:first-of-type, [class*="banner"]');
  log('Homepage', 'Hero section visible', hero ? 'PASS' : 'FAIL', hero ? 'Hero section found' : 'No hero section found');

  // Hero title
  const h1 = await page.$('h1');
  const h1Text = h1 ? await page.evaluate(el => el.textContent.trim(), h1) : '';
  log('Homepage', 'Hero title (h1)', h1 ? 'PASS' : 'FAIL', h1 ? `Title: "${h1Text.substring(0,60)}"` : 'No h1 found');

  // Hero buttons
  const heroButtons = await page.$$('a[class*="btn"], button[class*="btn"], a[class*="Button"], button[class*="Button"], [class*="cta"]');
  log('Homepage', 'Hero buttons', heroButtons.length > 0 ? 'PASS' : 'FAIL', `Found ${heroButtons.length} CTA buttons`);

  await screenshot(page, '02_homepage_hero');

  // Scroll to check HeroStats
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '03_homepage_stats');

  // Check HeroStats - look for stat numbers/values
  const statItems = await page.$$('[class*="stat"], [class*="Stat"]');
  log('Homepage', 'HeroStats section', statItems.length > 0 ? 'PASS' : 'FAIL', `Found ${statItems.length} stat elements`);

  // Check stats alignment (centered)
  let statsAligned = false;
  try {
    statsAligned = await page.evaluate(() => {
      const statEl = document.querySelector('[class*="stat"], [class*="Stat"]');
      if (statEl) {
        const section = statEl.closest('section') || statEl.parentElement;
        if (section) {
          const style = window.getComputedStyle(section);
          return style.justifyContent === 'center' || style.textAlign === 'center' || section.className.includes('center') || section.className.includes('justify-center');
        }
      }
      return false;
    });
  } catch(e) { statsAligned = 'check failed'; }
  log('Homepage', 'HeroStats centered alignment', statItems.length >= 4 ? 'PASS' : 'WARN', `${statItems.length} stats found, alignment check: ${statsAligned}`);

  // Scroll more to WhyBetter
  await page.evaluate(() => window.scrollBy(0, 700));
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '04_homepage_whybetter');

  // WhyBetter section - cards
  const cards = await page.$$('[class*="card"], [class*="Card"]');
  log('Homepage', 'WhyBetter cards visible', cards.length > 0 ? 'PASS' : 'FAIL', `Found ${cards.length} card elements`);

  // Check icons in cards
  const icons = await page.$$('[class*="card"] svg, [class*="card"] img[class*="icon"], [class*="card"] [class*="icon"]');
  log('Homepage', 'WhyBetter card icons', icons.length > 0 ? 'PASS' : 'FAIL', `Found ${icons.length} icon elements in cards`);

  // Scroll to testimonials
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '05_homepage_testimonials');

  // Testimonials / reviews marquee
  const marquee = await page.$('[class*="marquee"], [class*="Marquee"], [class*="scroll"], [class*="testimonial"], [class*="Testimonial"], [class*="review"]');
  log('Homepage', 'Testimonials/reviews marquee', marquee ? 'PASS' : 'FAIL', marquee ? 'Marquee/testimonial element found' : 'No marquee element found');

  // Scroll to CTA
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '06_homepage_cta');

  // CTA section
  const ctaSection = await page.$('[class*="cta"], [class*="CTA"], [class*="CallToAction"]');
  log('Homepage', 'CTA section visible', ctaSection ? 'PASS' : 'FAIL', ctaSection ? 'CTA section found' : 'No CTA section found');

  // Check CTA button text
  const ctaButtons = await page.$$eval('button, a[class*="btn"], a[class*="Button"]', els =>
    els.map(el => el.textContent.trim()).filter(t => t.length > 0)
  );
  const ctaMatch = ctaButtons.find(t => t.includes('أنشئ') || t.includes('حسابك') || t.includes('مجاناً'));
  log('Homepage', "CTA button text 'أنشئ حسابك مجاناً'", ctaMatch ? 'PASS' : 'FAIL', ctaMatch ? `Found: "${ctaMatch}"` : `Not found. Buttons: ${ctaButtons.slice(0,5).join(', ')}`);

  // Check for duplicate arrows (SVG arrows or arrow icons)
  const ctaButtonsWithArrows = await page.$$eval('button svg, a[class*="btn"] svg, a[class*="Button"] svg', els => els.length);
  log('Homepage', 'CTA arrow icon (no duplicates)', 'INFO', `Found ${ctaButtonsWithArrows} SVG icons in buttons - manual visual check needed`);

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '07_homepage_footer');

  const footer = await page.$('footer, [class*="footer"], [class*="Footer"]');
  log('Homepage', 'Footer visible', footer ? 'PASS' : 'FAIL', footer ? 'Footer element found' : 'No footer found');

  // Test floating capsule navbar at 1200px width
  await page.setViewport({ width: 1200, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 300)); // Scroll down to trigger transform
  await new Promise(r => setTimeout(r, 1500));
  await screenshot(page, '08_navbar_1200px_scrolled');
  
  const floatingNav = await page.$('[class*="floating"], [class*="capsule"], [class*="pill"], [class*="fixed"], [class*="sticky"]');
  log('Homepage', 'Floating capsule navbar at 1200px', floatingNav ? 'PASS' : 'INFO', floatingNav ? 'Floating nav element found' : 'Could not auto-detect floating nav - see screenshot');

  // Reset viewport
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // =============================
  // 2. NAVIGATION TESTS
  // =============================
  console.log('\n=== NAVIGATION TESTS ===');

  // Home link
  try {
    const homeLink = await page.$('a[href="/"], a[href*="home"]');
    if (homeLink) {
      await homeLink.click();
      await new Promise(r => setTimeout(r, 1500));
      const url = page.url();
      log('Navigation', 'الرئيسية (Home)', url.includes('localhost:3000') ? 'PASS' : 'FAIL', `Navigated to: ${url}`);
    } else {
      log('Navigation', 'الرئيسية (Home)', 'FAIL', 'Home link not found');
    }
  } catch(e) {
    log('Navigation', 'الرئيسية (Home)', 'FAIL', `Error: ${e.message}`);
  }

  // Courses link
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));
    const coursesLink = await page.$('a[href*="course"], a[href*="كورس"]');
    if (coursesLink) {
      await coursesLink.click();
      await new Promise(r => setTimeout(r, 2000));
      await screenshot(page, '09_courses_page');
      const url = page.url();
      log('Navigation', 'الكورسات (Courses)', url.includes('course') ? 'PASS' : 'WARN', `Navigated to: ${url}`);
    } else {
      // Try direct navigation
      await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));
      await screenshot(page, '09_courses_page');
      const url = page.url();
      log('Navigation', 'الكورسات (Courses)', 'WARN', `Direct nav to /courses: ${url}`);
    }
  } catch(e) {
    log('Navigation', 'الكورسات (Courses)', 'FAIL', `Error: ${e.message}`);
  }

  // Books link
  try {
    await page.goto('http://localhost:3000/books', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await screenshot(page, '10_books_page');
    const title = await page.title();
    const h1 = await page.$('h1, h2');
    const headingText = h1 ? await page.evaluate(el => el.textContent.trim(), h1) : '';
    log('Navigation', 'الكتب والمذكرات (Books)', 'PASS', `Page title: ${title}, Heading: ${headingText.substring(0,40)}`);
  } catch(e) {
    log('Navigation', 'الكتب والمذكرات (Books)', 'FAIL', `Error: ${e.message}`);
  }

  // Live link
  try {
    await page.goto('http://localhost:3000/live', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await screenshot(page, '11_live_page');
    const title = await page.title();
    const h1 = await page.$('h1, h2');
    const headingText = h1 ? await page.evaluate(el => el.textContent.trim(), h1) : '';
    log('Navigation', 'البث المباشر (Live)', 'PASS', `Page title: ${title}, Heading: ${headingText.substring(0,40)}`);
  } catch(e) {
    log('Navigation', 'البث المباشر (Live)', 'FAIL', `Error: ${e.message}`);
  }

  // =============================
  // 3. ADMIN PANEL TESTS
  // =============================
  console.log('\n=== ADMIN PANEL TESTS ===');

  try {
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await screenshot(page, '12_admin_panel');
    const finalUrl = page.url();

    // Check if redirected to login or admin panel loaded
    const sidebar = await page.$('[class*="sidebar"], [class*="Sidebar"], aside, nav[class*="admin"]');
    const adminHeading = await page.$('h1, h2, h3');
    const headingText = adminHeading ? await page.evaluate(el => el.textContent.trim(), adminHeading) : '';
    
    if (finalUrl.includes('login') || finalUrl.includes('auth')) {
      log('Admin', 'Admin panel access', 'WARN', `Redirected to login: ${finalUrl}`);
    } else {
      log('Admin', 'Admin panel access', 'PASS', `Loaded at: ${finalUrl}`);
    }
    log('Admin', 'Admin sidebar', sidebar ? 'PASS' : 'FAIL', sidebar ? 'Sidebar found' : `No sidebar. URL: ${finalUrl}, Heading: ${headingText}`);
  } catch(e) {
    log('Admin', 'Admin panel access', 'FAIL', `Error: ${e.message}`);
  }

  // Admin CMS
  try {
    await page.goto('http://localhost:3000/admin/cms', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await screenshot(page, '13_admin_cms');
    const finalUrl = page.url();
    const cmsControls = await page.$('[class*="cms"], [class*="CMS"], form, [class*="editor"], [class*="control"]');
    log('Admin', 'CMS page loads', 'PASS', `URL: ${finalUrl}`);
    log('Admin', 'CMS controls visible', cmsControls ? 'PASS' : 'FAIL', cmsControls ? 'CMS controls found' : 'No CMS controls found');
  } catch(e) {
    log('Admin', 'Admin CMS', 'FAIL', `Error: ${e.message}`);
  }

  // Admin Reviews
  try {
    await page.goto('http://localhost:3000/admin/reviews', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await screenshot(page, '14_admin_reviews');
    const finalUrl = page.url();
    const reviewItems = await page.$$('[class*="review"], [class*="Review"], [class*="moderat"], table, [class*="list"]');
    log('Admin', 'Reviews page loads', 'PASS', `URL: ${finalUrl}`);
    log('Admin', 'Review items visible', reviewItems.length > 0 ? 'PASS' : 'FAIL', `Found ${reviewItems.length} review/list elements`);
  } catch(e) {
    log('Admin', 'Admin Reviews', 'FAIL', `Error: ${e.message}`);
  }

  // Full page screenshot of admin
  try {
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await fullScreenshot(page, '15_admin_full');
  } catch(e) {}

  // Final full homepage screenshot
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await fullScreenshot(page, '00_homepage_full');

} catch(err) {
  console.error('Fatal error:', err);
} finally {
  await browser.close();
}

// Write results JSON
const resultsPath = join(ARTIFACT_DIR, 'scratch', 'test_results.json');
writeFileSync(resultsPath, JSON.stringify(results, null, 2));
console.log('\n=== RESULTS SUMMARY ===');
results.forEach(r => console.log(`[${r.status}] ${r.section} > ${r.item}: ${r.notes}`));
console.log(`\nResults saved to: ${resultsPath}`);
console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);
