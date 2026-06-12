import { expect, test, type Locator, type Page } from "@playwright/test";

const pages = [
  {
    name: "Home",
    path: "/",
    heading: "Where Nature Meets Innovation",
    content: "Connecting people, process, and technology for real-time business",
  },
  {
    name: "Approach",
    path: "/approach/",
    heading: "From challenge to clear change.",
    content: "Strategy-to-Implementation Engagement",
  },
  {
    name: "Capabilities",
    path: "/capabilities/",
    heading: "The right tools for the right moment.",
    content: "Equal-weight examples, not preset choices.",
  },
  {
    name: "About",
    path: "/about/",
    heading: "Built on purpose. Driven by people.",
    content: "connecting people, process, and technology",
  },
  {
    name: "Contact",
    path: "/contact/",
    heading: "Let's build something together.",
    content: "Tell us about your project",
  },
];

const navItems = [
  {
    name: "Approach",
    path: "/approach/",
    heading: "From challenge to clear change.",
  },
  {
    name: "About",
    path: "/about/",
    heading: "Built on purpose. Driven by people.",
  },
  {
    name: "Contact",
    path: "/contact/",
    heading: "Let's build something together.",
  },
];

const expectCoreLandmarks = async (page: Page) => {
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Footer navigation" })).toBeVisible();
};

const expectUsableHeadingStructure = async (page: Page) => {
  const headings = await page
    .locator("h1, h2, h3, h4, h5, h6")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        level: Number(node.tagName.slice(1)),
        text: node.textContent?.replace(/\s+/g, " ").trim(),
      })),
    );

  expect(headings.filter((heading) => heading.level === 1)).toHaveLength(1);
  expect(headings[0]?.level).toBe(1);

  for (let index = 1; index < headings.length; index += 1) {
    expect(headings[index].level - headings[index - 1].level).toBeLessThanOrEqual(1);
  }
};

const primaryNav = (page: Page): Locator =>
  page.viewportSize()?.width && page.viewportSize()!.width < 768
    ? page.getByRole("navigation", { name: "Mobile navigation" })
    : page.getByRole("navigation", { name: "Primary navigation" });

test.describe("top-level page verification", () => {
  for (const sitePage of pages) {
    test(`${sitePage.name} renders with landmarks and stable layout`, async ({ page }) => {
      await page.goto(sitePage.path);

      await expect(
        page.getByRole("heading", { level: 1, name: sitePage.heading }),
      ).toBeVisible();
      await expect(page.getByText(sitePage.content).first()).toBeVisible();
      await expectCoreLandmarks(page);
      await expectUsableHeadingStructure(page);

      const pageOverflow = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        pageWidth: document.documentElement.scrollWidth,
      }));

      expect(pageOverflow.pageWidth).toBeLessThanOrEqual(pageOverflow.viewportWidth + 1);
    });
  }
});

test.describe("navigation", () => {
  test("desktop navigation reaches every top-level page", async ({ page, isMobile }) => {
    test.skip(isMobile, "Covered by the mobile navigation test.");

    await page.goto("/");
    const nav = primaryNav(page);

    for (const item of navItems) {
      await nav.getByRole("link", { name: item.name }).click();
      await expect(page).toHaveURL(item.path);
      await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    }
  });

  test("mobile navigation reaches every top-level page", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Covered by the desktop navigation test.");

    for (const item of navItems) {
      await page.goto("/");
      await page.getByLabel("Open navigation").click();
      await primaryNav(page).getByRole("link", { name: item.name }).click();
      await expect(page).toHaveURL(item.path);
      await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    }
  });
});

test.describe("home proof carousel", () => {
  test("appears after the process section and supports keyboard controls", async ({ page }) => {
    await page.goto("/");

    const proofSection = page.getByRole("region", { name: "Client story proof" });
    await expect(proofSection).toBeVisible();

    const sectionOrder = await page.locator("main > section").evaluateAll((sections) =>
      sections.map((section) => ({
        className: section.className,
        heading: section.querySelector("h1, h2")?.textContent?.replace(/\s+/g, " ").trim(),
      })),
    );
    expect(sectionOrder[0]).toMatchObject({ className: expect.stringContaining("home-hero") });
    expect(sectionOrder[1]).toMatchObject({
      className: expect.stringContaining("section-band--linen"),
      heading: "We simplify the complex & create a clear path forward.",
    });
    expect(sectionOrder[2]).toMatchObject({
      className: expect.stringContaining("expertise-section"),
      heading: "The right tools. The right time. The right team.",
    });
    expect(sectionOrder[3]).toMatchObject({
      className: expect.stringContaining("section-band--forest"),
      heading: "Agile Innovation — from challenge to change.",
    });
    expect(sectionOrder[4]).toMatchObject({
      className: expect.stringContaining("proof-section"),
      heading: "Trusted by leaders who think differently.",
    });

    await expect(page.getByText("Paul Nutting")).toBeVisible();
    await page.getByRole("button", { name: "Next client story" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Show client story 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});

test.describe("contact form", () => {
  test("contains the approved first-step fields and omits budget and timeline", async ({ page }) => {
    await page.goto("/contact/");

    await expect(page.getByLabel("First Name")).toBeVisible();
    await expect(page.getByLabel("Last Name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Company / Organization")).toBeVisible();
    await expect(page.getByLabel("What problem are you facing?")).toBeVisible();

    await expect(page.getByLabel(/budget/i)).toHaveCount(0);
    await expect(page.getByLabel(/timeline/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  });
});

test.describe("accessibility behavior", () => {
  test("skip link and keyboard focus are visible", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const activeElement = page.locator(":focus");
    await expect(activeElement).toHaveText("Skip to main content");
    await expect(activeElement).toBeInViewport();
    await expect(activeElement).toHaveCSS("outline-style", "solid");
  });

  test("reduced motion keeps carousel autoplay disabled", async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: "http://127.0.0.1:4321",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByRole("button", { name: "Show client story 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await page.waitForTimeout(5200);
    await expect(page.getByRole("button", { name: "Show client story 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await context.close();
  });
});
