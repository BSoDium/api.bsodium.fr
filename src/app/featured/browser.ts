import puppeteer, { Browser, Page } from "puppeteer";
import { addExtra } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Add stealth plugin to avoid bot detection
const puppeteerExtra = addExtra(puppeteer);
puppeteerExtra.use(StealthPlugin());

export interface BrowserOptions {
  headless?: boolean;
  timeout?: number;
  userAgent?: string;
}

export class BrowserManager {
  private browser: Browser | null = null;
  private options: BrowserOptions;

  constructor(options: BrowserOptions = {}) {
    this.options = {
      headless: true, // Always run headless to prevent UI interactions
      timeout: 30000,
      ...options,
    };
  }

  async launch(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    console.log("Launching browser...");
    this.browser = await puppeteerExtra.launch({
      headless: this.options.headless ?? true, // Force headless by default
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-web-security",
        "--window-size=1920,1080",
        "--disable-notifications",
        "--disable-popup-blocking",
      ],
    });

    return this.browser;
  }

  async newPage(): Promise<Page> {
    const browser = await this.launch();
    const page = await browser.newPage();

    // Set viewport to simulate a real browser
    await page.setViewport({ width: 1920, height: 1080 });

    // Set a realistic user agent if provided
    if (this.options.userAgent) {
      await page.setUserAgent(this.options.userAgent);
    }

    // Add extra headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    // Prevent download dialogs by handling downloads programmatically
    const client = await page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "deny", // Deny all downloads to prevent modals
    });

    // Set default timeout
    page.setDefaultTimeout(this.options.timeout!);

    return page;
  }

  async close(): Promise<void> {
    if (this.browser) {
      console.log("Closing browser...");
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Fetches a URL and returns the text content
   */
  async fetchText(url: string, waitForSelector?: string): Promise<string> {
    const page = await this.newPage();
    try {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle2" });

      // Wait a bit for any dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // If a selector is provided, wait for it
      if (waitForSelector) {
        await page
          .waitForSelector(waitForSelector, { timeout: 10000 })
          .catch(() => {
            console.warn(
              `Selector ${waitForSelector} not found, continuing anyway...`
            );
          });
      }

      const content = await page.content();
      return content;
    } finally {
      await page.close();
    }
  }
}

/**
 * Singleton instance for shared browser usage
 */
let browserManager: BrowserManager | null = null;

export function getBrowserManager(options?: BrowserOptions): BrowserManager {
  if (!browserManager) {
    browserManager = new BrowserManager(options);
  }
  return browserManager;
}

export async function closeBrowser(): Promise<void> {
  if (browserManager) {
    await browserManager.close();
    browserManager = null;
  }
}
