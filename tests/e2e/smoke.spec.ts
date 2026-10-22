import { expect, test } from "@playwright/test";

const errors: string[] = [];
// React #418 is a recoverable hydration error that Next 15 occasionally reports under heavy CPU load.
// React re-renders on the client, so nothing visible breaks. Every other error fails the test.
const KNOWN = /Minified React error #418/;
test.beforeEach(({ page }) => {
  errors.length = 0;
  page.on("pageerror", (e) => { if (!KNOWN.test(e.message)) errors.push(e.message); });
  page.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errors.push(m.text()); });
});
test.afterEach(() => expect(errors, errors.join("\n")).toEqual([]));

const PRAISE = /Sharp sharp|Lekker|Spot on|Eish, you're good|Yebo|Too clean/;

test.describe("PhysicsMzansi smoke tests", () => {
  test("home page renders hero and strands", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Physics and Chemistry");
    await expect(page.getByRole("heading", { name: /Electricity/ }).first()).toBeVisible();
  });

  test("lesson: typed practice with units is checked", async ({ page }) => {
    await page.goto("/learn/fertiliser-industry", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("fertilisers");
    await page.getByRole("button", { name: /3\. NPK calculations/ }).first().click();
    const input = page.getByRole("textbox", { name: "Your answer" }).first();
    await input.fill("4,4");
    await page.getByRole("button", { name: "Check", exact: true }).first().click();
    await expect(page.getByText("Not yet.").first()).toBeVisible();
    await input.fill("1,89 kg");
    await page.getByRole("button", { name: "Check", exact: true }).first().click();
    await expect(page.getByText(PRAISE).first()).toBeVisible();
  });

  test("worked example reveals step by step", async ({ page }) => {
    await page.goto("/learn/chemical-equilibrium", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /2\. The equilibrium constant Kc/ }).first().click();
    await page.getByRole("button", { name: "Show step 1" }).click();
    await expect(page.getByText(/Use the mole ratio for the CHANGE row only/)).toBeVisible();
  });

  test("toolkit: a simulation waits for Play", async ({ page }) => {
    await page.goto("/toolkit", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Projectile lab/ }).click();
    const play = page.getByRole("button", { name: "Play" }).first();
    await expect(play).toBeVisible();
    await play.click();
    await expect(page.getByRole("button", { name: "Pause" }).first()).toBeVisible();
  });

  test("speed solve starts", async ({ page }) => {
    await page.goto("/games", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Start/ }).first().click();
    await expect(page.getByRole("textbox", { name: "Your answer" })).toBeVisible();
  });

  test("flashcards flip and record", async ({ page }) => {
    await page.goto("/flashcards");
    await page.getByRole("button", { name: "Show answer" }).click();
    await page.getByRole("button", { name: /I knew it/ }).click();
    await expect(page.getByText(/Card 2 of/)).toBeVisible();
  });

  test("exam room self-marking", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: /Trolleys collide/ }).click();
    await page.getByRole("button", { name: /Show the memo/ }).first().click();
    await page.locator("li button[aria-pressed]").first().click();
    await page.getByRole("button", { name: "Save my mark" }).first().click();
    await expect(page.getByText("Saved ✓")).toBeVisible();
  });

  test("quiz arena round starts", async ({ page }) => {
    await page.goto("/quiz");
    await page.getByRole("button", { name: "Start round" }).click();
    await expect(page.getByText(/Question 1 \/ 10/)).toBeVisible();
  });

  test("preferences panel toggles calm mode", async ({ page }) => {
    await page.goto("/learn");
    await page.getByRole("button", { name: "Open learning preferences" }).click();
    await page.getByText("Calm mode").click();
    await expect(page.locator("html")).toHaveClass(/calm/);
  });

  test("mock lobby lists six full mocks", async ({ page }) => {
    await page.goto("/exam/mock");
    await expect(page.getByRole("link", { name: /Full mock/ })).toHaveCount(6);
  });

  test("curriculum API returns JSON", async ({ request }) => {
    const body = await (await request.get("/api/curriculum")).json();
    expect(body.lessons.length).toBeGreaterThanOrEqual(48);
    expect(body.topics.length).toBe(45);
  });

  for (const path of ["/", "/learn", "/learn/describing-motion", "/learn/newtons-laws", "/learn/electrodynamics", "/learn/the-atom", "/learn/organic-naming", "/learn/electrochemistry", "/flashcards", "/quiz", "/exam", "/exam/mock", "/exam/mock/g12-p1", "/toolkit", "/games", "/progress", "/teachers/worksheets", "/teachers/docs/data-sheets"]) {
    test(`no sideways scrolling on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
