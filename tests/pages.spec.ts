import { expect, test, type Locator, type Page } from "@playwright/test";

const pages = [
  {
    name: "Home",
    path: "/",
    heading: "Strategic Innovation Studio.",
    content: "Connecting people, process, and technology",
  },
  {
    name: "Approach",
    path: "/approach/",
    heading: "From complex challenge to implemented solution.",
    content: "Strategy-to-Implementation Engagement",
  },
  {
    name: "Capabilities",
    path: "/capabilities/",
    heading: "Examples of work shaped around your situation.",
    content: "Equal-weight examples, not preset choices.",
  },
  {
    name: "About",
    path: "/about/",
    heading: "Founder-led judgment for strategy and implementation.",
    content: "The people behind the work.",
  },
  {
    name: "Contact",
    path: "/contact/",
    heading: "Start with the challenge, then build together.",
    content: "Tell us what you are trying to solve.",
  },
];

const navItems = pages.map(({ name, path }) => ({ name, path }));

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
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        pages.find((sitePage) => sitePage.name === item.name)!.heading,
      );
    }
  });

  test("mobile navigation reaches every top-level page", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Covered by the desktop navigation test.");

    for (const item of navItems) {
      await page.goto("/");
      await page.getByLabel("Open navigation").click();
      await primaryNav(page).getByRole("link", { name: item.name }).click();
      await expect(page).toHaveURL(item.path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        pages.find((sitePage) => sitePage.name === item.name)!.heading,
      );
    }
  });
});

test.describe("home proof carousel", () => {
  test("appears directly after the hero and supports keyboard controls", async ({ page }) => {
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
  test("contains the agreed fields and omits budget and timeline", async ({ page }) => {
    await page.goto("/contact/");

    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Organization")).toBeVisible();
    await expect(page.getByLabel("Role or title")).toBeVisible();
    await expect(page.getByLabel("What are you trying to solve?")).toBeVisible();

    await expect(page.getByLabel(/budget/i)).toHaveCount(0);
    await expect(page.getByLabel(/timeline/i)).toHaveCount(0);
    await expect(page.getByText(/quote request/i)).toBeVisible();
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
