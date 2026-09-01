import { chromium } from "playwright";

const baseUrl = process.env.ATHLEX_QA_BASE_URL ?? "https://coachxsync1-zeta.vercel.app";
const cases = [
  { name: "ES-mobile", locale: "es", width: 375, height: 812 },
  { name: "DE-mobile", locale: "de", width: 375, height: 812 },
  { name: "ES-wide", locale: "es", width: 430, height: 932 },
  { name: "DE-wide", locale: "de", width: 430, height: 932 }
];
const credentials = {
  ATHLEX_QA_A_BROWSER: {
    email: process.env.ATHLEX_QA_A_EMAIL,
    password: process.env.ATHLEX_QA_A_PASSWORD
  },
  ATHLEX_QA_B_BROWSER: {
    email: process.env.ATHLEX_QA_B_EMAIL,
    password: process.env.ATHLEX_QA_B_PASSWORD
  }
};
const contextNames = (process.env.ATHLEX_QA_CONTEXTS ?? "ATHLEX_QA_A_BROWSER,ATHLEX_QA_B_BROWSER").split(",").filter(Boolean);

function isHydrationMessage(message) {
  return /hydration|Minified React error #418|Text content does not match/i.test(message);
}

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const contextName of contextNames) {
    const context = await browser.newContext();
    const credential = credentials[contextName];
    let authenticated = false;
    for (const testCase of cases) {
      const page = await context.newPage();
      await page.setViewportSize({ width: testCase.width, height: testCase.height });
      await page.addInitScript((locale) => {
        localStorage.setItem("athlexforce-locale-v1", locale);
        document.cookie = `athlexforce-locale=${locale}; path=/`;
      }, testCase.locale);

      const errors = [];
      const httpErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error" || isHydrationMessage(message.text())) {
          const location = message.location().url;
          errors.push(location ? `${message.text()} [${location}]` : message.text());
        }
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", async (response) => {
        if (response.status() >= 400 && response.status() < 600) {
          let body = "";
          if (response.status() === 409) {
            try {
              body = (await response.text()).slice(0, 500);
            } catch {
              body = "<unreadable>";
            }
          }
          httpErrors.push({ status: response.status(), url: response.url(), body });
        }
      });

      if (credential.email && credential.password && !authenticated) {
        await page.goto(`${baseUrl}/entry`, { waitUntil: "domcontentloaded", timeout: 15000 });
        const emailField = page.getByRole("textbox", { name: "Correo electrónico" });
        try {
          await emailField.waitFor({ state: "visible", timeoutMs: 15000 });
        } catch {
          throw new Error(`QA login form missing at ${page.url()}: ${(await page.locator("body").innerText()).slice(0, 500)}`);
        }
        await emailField.fill(credential.email);
        await page.getByRole("textbox", { name: "Contraseña" }).fill(credential.password);
        await page.getByRole("button", { name: "Entrar" }).click();
        await page.waitForTimeout(5000);
        if (new URL(page.url()).pathname === "/entry") {
          throw new Error(`QA authentication did not leave the entry route: ${(await page.locator("body").innerText()).slice(0, 700)}`);
        }
        authenticated = true;
      }

      for (let iteration = 0; iteration < 5; iteration += 1) {
        await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.reload({ waitUntil: "domcontentloaded", timeout: 15000 });
      }
      for (let iteration = 0; iteration < 5; iteration += 1) {
        await page.goto(`${baseUrl}/calendar`, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
      }

      results.push({
        context: contextName,
        case: testCase.name,
        url: page.url(),
        errors: [...new Set(errors)],
        hydrationErrors: [...new Set(errors.filter(isHydrationMessage))],
        httpErrors: [...new Map(httpErrors.map((error) => [`${error.status}:${error.url}`, error])).values()]
      });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((result) => result.errors.length > 0 || result.hydrationErrors.length > 0);
console.log(JSON.stringify({ baseUrl, results, pass: failed.length === 0 }, null, 2));
process.exitCode = failed.length === 0 ? 0 : 1;
