const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const baseURL = "http://localhost:5173";
const apiURL = "https://gist.githubusercontent.com/vaishh-05/a5c87485ca8a04de37371506dd509602/raw/announcements.json";

fs.mkdirSync("screenshots/light", { recursive: true });
fs.mkdirSync("screenshots/dark", { recursive: true });

async function shot(folder, number, name) {
await page.screenshot({
path: `screenshots/${folder}/${number}-${name}.png`,
fullPage: true
});
}

async function makeLight() {
const button = page.getByRole("button", { name: "Switch to Light" });
if (await button.count()) {
await button.click();
await page.waitForTimeout(300);
}
}

async function makeDark() {
const button = page.getByRole("button", { name: "Switch to Dark" });
if (await button.count()) {
await button.click();
await page.waitForTimeout(300);
}
}

async function runTests(folder, dark) {
await page.goto(baseURL);
await page.waitForTimeout(1000);

if (dark) await makeDark();
else await makeLight();

await shot(folder, "01", "home-announcements");

await page.route(`${apiURL}*`, route => route.abort());
await page.reload();
await page.waitForTimeout(1000);

if (dark) await makeDark();
else await makeLight();

await shot(folder, "02", "error-state");
await page.unroute(`${apiURL}*`);

await page.goto(`${baseURL}/events`);
await page.waitForTimeout(500);

if (dark) await makeDark();
else await makeLight();

await shot(folder, "03", "events");

await page.getByPlaceholder("Search events...").fill("web");
await page.waitForTimeout(300);
await shot(folder, "04", "search-web");

await page.getByRole("combobox").selectOption("Technical");
await page.waitForTimeout(300);
await shot(folder, "05", "technical-filter");

await page.getByRole("combobox").selectOption("All");

const firstCard = page.locator(".event-card").first();
const seatsText = firstCard.locator("p").filter({ hasText: "Seats left:" });
const seatsString = await seatsText.textContent();
const seats = parseInt(seatsString.match(/\d+/)[0]);

for (let i = 0; i < seats; i++) {
await firstCard.getByRole("button", { name: "Register" }).click();
}

await page.waitForTimeout(300);
await shot(folder, "06", "sold-out");

await page.goto(`${baseURL}/register`);
await page.waitForTimeout(500);

if (dark) await makeDark();
else await makeLight();

await page.getByRole("button", { name: "Submit" }).click();
await page.waitForTimeout(300);
await shot(folder, "07", "form-validation");

const inputs = page.locator("form input");
await inputs.nth(0).fill("Vaishnav M N");
await inputs.nth(1).fill("vaishnavmn@example.com");
await inputs.nth(2).fill("9894582364");

await page.getByRole("button", { name: "Submit" }).click();
await page.waitForTimeout(500);
await shot(folder, "08", "successful-registration");

await page.goto(`${baseURL}/gallery`);
await page.waitForTimeout(700);

if (dark) await makeDark();
else await makeLight();

await shot(folder, "09", "gallery");

await page.goto(`${baseURL}/doesnotexist`);
await page.waitForTimeout(500);

if (dark) await makeDark();
else await makeLight();

await shot(folder, "10", "404-page");
}

console.log("Taking LIGHT screenshots...");
await runTests("light", false);

console.log("Taking DARK screenshots...");
await runTests("dark", true);

await browser.close();

console.log("");
console.log("========================================");
console.log("DONE - 20 screenshots created!");
console.log("========================================");
})();
