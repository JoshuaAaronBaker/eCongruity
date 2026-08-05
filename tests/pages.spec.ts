import { expect, test, type Locator, type Page } from "@playwright/test";

const pages = [
  {
    name: "Home",
    path: "/",
    heading: "Where Boundless Horizons Inspire Bold Innovation",
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
    name: "What We Do",
    path: "/#work-heading",
    heading: "We simplify the complex & create a clear path forward.",
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

const mobileNavItems = [
  {
    name: "Home",
    path: "/",
    heading: "Where Boundless Horizons Inspire Bold Innovation",
  },
  ...navItems,
];

const sharedContentFrame = (viewportWidth: number) => {
  const width = viewportWidth < 1024
    ? viewportWidth - 64
    : viewportWidth < 1920
      ? Math.min(viewportWidth * 0.625, 1200)
      : Math.min(Math.max(viewportWidth * 0.625, 1200), 1600);
  return { x: (viewportWidth - width) / 2, width };
};

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

const waitForBrandFonts = async (page: Page) => {
  await page.evaluate(() => document.fonts.ready);
};

const captureViewportScreenshot = async (page: Page, path: string) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.screenshot({ path });
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(250);
    }
  }

  throw lastError;
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
      await expect(page.getByText(sitePage.content).filter({ visible: true }).first()).toBeVisible();
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

test.describe("brand typography and color system", () => {
  test("exposes the approved palette and font manifest", async ({ page }) => {
    await page.goto("/");

    const brand = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const fontLink = document.querySelector<HTMLLinkElement>(
        'link[href*="fonts.googleapis.com/css2"]',
      );

      return {
        colors: Object.fromEntries(
          ["moss", "fern", "sage", "mist", "linen", "bark", "cream", "gold", "ink", "white"].map(
            (name) => [name, root.getPropertyValue(`--${name}`).trim()],
          ),
        ),
        fontHref: fontLink?.href ?? "",
        fontSynthesis: root.fontSynthesis,
      };
    });

    expect(brand.colors).toEqual({
      moss: "#1E3A1E",
      fern: "#3D6B4A",
      sage: "#7BA08A",
      mist: "#B8CEB8",
      linen: "#F0EAE0",
      bark: "#8A7060",
      cream: "#FAF6EF",
      gold: "#C8A55A",
      ink: "#111A10",
      white: "#FDFAF5",
    });
    expect(brand.fontHref).toContain("Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400");
    expect(brand.fontHref).toContain("DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500");
    expect(brand.fontSynthesis).toBe("none");
  });

  test("uses the approved surface sequence and role-based font weights", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const expectations = [
      {
        path: "/",
        surfaces: [
          [".home-hero", "rgb(17, 26, 16)"],
          [".what-section-band", "rgb(250, 246, 239)"],
          [".expertise-section", "rgb(30, 58, 30)"],
          [".process-section", "rgb(17, 26, 16)"],
          [".proof-section", "rgb(240, 234, 224)"],
          [".about-closing-section", "rgb(30, 58, 30)"],
        ],
        type: [
          [".home-hero h1", "Cormorant Garamond", "300"],
          [".home-hero__lead", "DM Sans", "300"],
          [".what-section h2", "Cormorant Garamond", "300"],
          [".what-section__body", "DM Sans", "400"],
          [".hero-kicker", "DM Sans", "400"],
          [".what-card__face--front h3", "Cormorant Garamond", "600"],
          [".process-section .innovation-list h3", "DM Sans", "500"],
          [".desktop-nav .nav-link", "DM Sans", "400"],
          [".home-hero .button-link--primary", "DM Sans", "400"],
          [".site-footer p", "DM Sans", "400"],
        ],
      },
      {
        path: "/about/",
        surfaces: [
          [".about-hero", "rgb(17, 26, 16)"],
          [".about-mission-section", "rgb(250, 246, 239)"],
          [".about-story-section", "rgb(17, 26, 16)"],
          [".about-team-section", "rgb(240, 234, 224)"],
          [".about-values-section", "rgb(17, 26, 16)"],
          [".about-closing-section", "rgb(30, 58, 30)"],
        ],
        type: [
          [".about-hero h1", "Cormorant Garamond", "300"],
          [".about-values-section .values-grid h3", "Cormorant Garamond", "600"],
        ],
      },
      {
        path: "/contact/",
        surfaces: [[".contact-panel", "rgb(17, 26, 16)"]],
        type: [
          [".contact-intro h1", "Cormorant Garamond", "300"],
          [".contact-form label", "DM Sans", "400"],
        ],
      },
    ] as const;

    for (const expectation of expectations) {
      await page.goto(expectation.path);

      for (const [selector, color] of expectation.surfaces) {
        await expect(page.locator(selector)).toHaveCSS("background-color", color);
      }

      for (const [selector, family, weight] of expectation.type) {
        const styles = await page.locator(selector).evaluateAll((nodes) =>
          nodes.map((node) => {
            const computed = getComputedStyle(node);
            return { family: computed.fontFamily, weight: computed.fontWeight };
          }),
        );
        expect(styles.length, `${expectation.path} ${selector}`).toBeGreaterThan(0);
        for (const style of styles) {
          expect(style.family).toContain(family);
          expect(style.weight).toBe(weight);
        }
      }
    }
  });

  test("keeps every primary page and section title to three lines or fewer", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    for (const viewport of [
      { width: 320, height: 844 },
      { width: 390, height: 844 },
      { width: 744, height: 1024 },
      { width: 1280, height: 900 },
      { width: 1920, height: 1080 },
    ]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
      const page = await context.newPage();

      for (const sitePage of pages) {
        await page.goto(sitePage.path);
        await page.evaluate(() => document.fonts.ready);
        const titles = await page.locator("main h1, main h2").evaluateAll((nodes) => {
          const lineCount = (node: Element) => {
            const rect = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            const lineHeight = style.lineHeight === "normal"
              ? Number.parseFloat(style.fontSize) * 1.2
              : Number.parseFloat(style.lineHeight);
            const layoutHeight = node instanceof HTMLElement ? node.offsetHeight : rect.height;
            return Math.max(1, Math.ceil(layoutHeight / lineHeight - 0.08));
          };

          return nodes
            .filter((node) => {
              const rect = node.getBoundingClientRect();
              const style = getComputedStyle(node);
              return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
            })
            .map((node) => {
              const groups = Array.from(
                node.querySelectorAll<HTMLElement>(":scope > .copy-lines, :scope > .about-mission__lines"),
              );
              const visibleGroup = groups.find((group) => {
                const rect = group.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && getComputedStyle(group).display !== "none";
              });
              const directLines = Array.from(node.children).filter((child) =>
                child.matches(".home-hero__title-line, .about-hero__title-line, .contact-headline__line"),
              );
              const lineNodes = visibleGroup ? Array.from(visibleGroup.children) : directLines;
              const lines = lineNodes.length > 0
                ? lineNodes.reduce((total, child) => total + lineCount(child), 0)
                : lineCount(node);

              return {
                lines,
                text: node.textContent?.replace(/\s+/g, " ").trim(),
              };
            });
        });

        for (const title of titles) {
          expect(title.lines, `${sitePage.path} "${title.text}" at ${viewport.width}px`).toBeLessThanOrEqual(3);
        }
      }

      await context.close();
    }
  });
});

test.describe("mobile horizontal gutters", () => {
  test("prevents horizontal scrolling while mobile reveal animations are pending", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own mobile viewport matrix.");

    for (const width of [320, 390]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        viewport: { width, height: 844 },
      });
      const page = await context.newPage();
      await page.goto("/");
      await waitForBrandFonts(page);
      await expect(page.locator("body")).toHaveAttribute("data-scroll-reveal-ready", "");

      const metrics = await page.evaluate(() => {
        const section = document.querySelector<HTMLElement>(".what-section");
        if (!section) throw new Error("Missing What We Do section");
        const rect = section.getBoundingClientRect();

        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          htmlOverflow: getComputedStyle(document.documentElement).overflowX,
          bodyOverflow: getComputedStyle(document.body).overflowX,
          sectionClientWidth: section.clientWidth,
          sectionScrollWidth: section.scrollWidth,
          leftGutter: rect.left,
          rightGutter: document.documentElement.clientWidth - rect.right,
        };
      });

      expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
      expect(["hidden", "clip"]).toContain(metrics.htmlOverflow);
      expect(["hidden", "clip"]).toContain(metrics.bodyOverflow);
      expect(metrics.sectionScrollWidth).toBeLessThanOrEqual(metrics.sectionClientWidth);
      expect(metrics.leftGutter).toBeCloseTo(32, 0);
      expect(metrics.rightGutter).toBeCloseTo(32, 0);

      await context.close();
    }
  });

  test("uses the shared content column across every page at common phone widths", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own mobile viewport matrix.");

    const pagesToCheck = [
      {
        path: "/",
        fitSelectors: [".home-hero h1"],
        selectors: [
          ".home-hero__content",
          ".what-section",
          ".expertise-section__grid",
          ".process-section__inner",
          ".proof-section > .site-container",
          ".about-closing",
        ],
      },
      {
        path: "/about/",
        fitSelectors: [".page-hero__inner > h1"],
        selectors: [
          ".page-hero__inner",
          ".about-mission",
          ".about-story",
          ".about-team",
          ".about-values__header",
          ".about-closing",
        ],
      },
      {
        path: "/approach/",
        fitSelectors: [],
        selectors: [
          ".page-hero__grid",
          ".approach-complexity",
          ".approach-signals",
          ".approach-map",
          ".approach-process",
          ".approach-working",
          ".about-closing",
        ],
      },
      {
        path: "/capabilities/",
        fitSelectors: [],
        selectors: [
          ".page-hero__grid",
          ".capability-fit",
          ".capability-index",
          ".capability-tailored",
          ".about-closing",
        ],
      },
      {
        path: "/contact/",
        fitSelectors: [],
        selectors: [".contact-grid"],
      },
    ];

    for (const width of [320, 375, 390, 430]) {
      const expectedContentWidth = width - 64;
      const expectedGutter = (width - expectedContentWidth) / 2;

      for (const pageConfig of pagesToCheck) {
        const context = await browser.newContext({
          deviceScaleFactor: 1,
          reducedMotion: "reduce",
          viewport: { width, height: 900 },
        });
        const page = await context.newPage();
        await page.goto(pageConfig.path);
        await waitForBrandFonts(page);

        const measurements = await page.evaluate(({ selectors, fitSelectors }) => ({
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          gutters: selectors.map((selector) => {
            const node = document.querySelector<HTMLElement>(selector);
            if (!node) throw new Error(`Missing mobile gutter target: ${selector}`);
            const rect = node.getBoundingClientRect();

            return {
              selector,
              left: rect.left,
              right: window.innerWidth - rect.right,
            };
          }),
          fittedContent: fitSelectors.map((selector) => {
            const node = document.querySelector<HTMLElement>(selector);
            if (!node) throw new Error(`Missing mobile fit target: ${selector}`);
            return {
              selector,
              clientWidth: node.clientWidth,
              scrollWidth: node.scrollWidth,
            };
          }),
        }), pageConfig);

        expect(measurements.scrollWidth).toBeLessThanOrEqual(measurements.viewportWidth + 1);
        for (const gutter of measurements.gutters) {
          expect(gutter.left, `${pageConfig.path} ${gutter.selector} uses the shared left gutter at ${width}px`).toBeCloseTo(expectedGutter, 0);
          expect(gutter.right, `${pageConfig.path} ${gutter.selector} uses the shared right gutter at ${width}px`).toBeCloseTo(expectedGutter, 0);
        }
        for (const content of measurements.fittedContent) {
          expect(
            content.scrollWidth,
            `${pageConfig.path} ${content.selector} fits its centered mobile column at ${width}px`,
          ).toBeLessThanOrEqual(content.clientWidth + 1);
        }

        await context.close();
      }
    }
  });
});

test.describe("site-wide content frame", () => {
  test("aligns every section and footer to the shared responsive gutters", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    for (const viewport of [
      { width: 320, height: 844 },
      { width: 390, height: 844 },
      { width: 744, height: 1024 },
      { width: 1280, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
      { width: 3440, height: 1440 },
    ]) {
      const expectedWidth = sharedContentFrame(viewport.width).width;
      const expectedGutter = (viewport.width - expectedWidth) / 2;
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      for (const sitePage of pages) {
        const page = await context.newPage();
        await page.goto(sitePage.path);
        await waitForBrandFonts(page);
        await page.waitForFunction(() => document.querySelector("main > section > .site-container"));

        const frames = await page.locator(
          "main > section > .site-container:not(.home-hero__grid), .site-footer__grid",
        ).evaluateAll((nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            className: node.className,
            left: rect.left,
            right: window.innerWidth - rect.right,
            width: rect.width,
          };
        }));

        for (const frame of frames) {
          expect(frame.left, `${sitePage.path} ${frame.className} left edge at ${viewport.width}px`).toBeCloseTo(expectedGutter, 0);
          expect(frame.right, `${sitePage.path} ${frame.className} right edge at ${viewport.width}px`).toBeCloseTo(expectedGutter, 0);
          expect(frame.width, `${sitePage.path} ${frame.className} width at ${viewport.width}px`).toBeCloseTo(expectedWidth, 0);
        }

        await page.close();
      }

      await context.close();
    }
  });
});

test.describe("large-screen responsive scaling", () => {
  test("scales the Home hero through large and ultrawide displays", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own wide viewport matrix.");

    const viewports = [
      { width: 1920, height: 1080, frameWidth: 1200, frameX: 360, titleSize: 120 },
      { width: 2560, height: 1440, frameWidth: 1600, frameX: 480, titleSize: 160 },
      { width: 3440, height: 1440, frameWidth: 1600, frameX: 645, titleSize: 160 },
      { width: 3840, height: 2160, frameWidth: 1600, frameX: 720, titleSize: 160 },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      await page.goto("/");
      await waitForBrandFonts(page);

      const metrics = await page.locator(".home-hero").evaluate((heroNode) => {
        const gridNode = heroNode.querySelector<HTMLElement>(".home-hero__grid");
        const titleNode = heroNode.querySelector<HTMLElement>("h1");
        const titleLines = Array.from(
          heroNode.querySelectorAll<HTMLElement>(
            ".home-hero__title-group--wide .home-hero__title-line",
          ),
        );
        const imageNode = heroNode.querySelector<HTMLElement>(".home-hero__mountain-image");

        if (!gridNode || !titleNode || !imageNode) {
          throw new Error("Home hero is incomplete");
        }

        const gridRect = gridNode.getBoundingClientRect();
        const titleRect = titleNode.getBoundingClientRect();
        const imageRect = imageNode.getBoundingClientRect();
        const heroRect = heroNode.getBoundingClientRect();

        return {
          grid: { x: gridRect.x, width: gridRect.width },
          title: {
            fontSize: Number.parseFloat(getComputedStyle(titleNode).fontSize),
            right: titleRect.right,
            lines: titleLines.length,
            linesFit: titleLines.every((line) => line.scrollWidth <= line.clientWidth + 1),
            emphasisColors: Array.from(
              heroNode.querySelectorAll<HTMLElement>(
                ".home-hero__title-group--wide em",
              ),
            ).map((node) => getComputedStyle(node).color),
          },
          mountainMatchesHero:
            Math.abs(imageRect.width - heroRect.width) <= 1
            && Math.abs(imageRect.height - heroRect.height) <= 1,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });

      expect(metrics.grid.x).toBeCloseTo(viewport.frameX, 0);
      expect(metrics.grid.width).toBeCloseTo(viewport.frameWidth, 0);
      expect(metrics.title.fontSize).toBe(viewport.titleSize);
      expect(metrics.title.lines).toBe(2);
      expect(metrics.title.linesFit).toBe(true);
      expect(metrics.title.emphasisColors).toEqual(["rgb(123, 160, 138)"]);
      expect(metrics.title.right).toBeLessThanOrEqual(viewport.width);
      expect(metrics.mountainMatchesHero).toBe(true);
      expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);

      if ([1920, 2560, 3440].includes(viewport.width)) {
        await page.locator(".home-hero").screenshot({
          path: `output/screenshots/home-hero-wide-${viewport.width}-final.png`,
        });
      }

      await context.close();
    }
  });

  test("keeps About spacing continuous and content-driven at desktop widths", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own wide viewport matrix.");

    const sectionHeights = new Map<number, number>();

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1799, height: 1000 },
      { width: 1800, height: 1000 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
      { width: 3440, height: 1440 },
      { width: 3840, height: 2160 },
    ]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const metrics = await page.evaluate(() => {
        const node = (selector: string) => {
          const target = document.querySelector<HTMLElement>(selector);
          if (!target) throw new Error(`Missing About target: ${selector}`);
          return target;
        };
        const rect = (selector: string) => node(selector).getBoundingClientRect();
        const gap = (before: string, after: string) => rect(after).top - rect(before).bottom;
        const missionSection = rect(".about-mission-section");
        const teamHeader = rect(".about-team__header");
        const teamGrid = rect(".about-team-section .team-grid");
        const teamGridNode = node(".about-team-section .team-grid");
        const valuesGridNode = node(".about-values-section .values-grid");
        const quoteNode = node(".mission-proof blockquote");

        return {
          missionHeight: missionSection.height,
          gaps: {
            missionEyebrowTitle: gap(".about-mission .eyebrow", ".about-mission h2"),
            missionTitleCopy: gap(".about-mission h2", ".about-mission__body--primary"),
            missionQuoteStats: gap(".mission-proof blockquote", ".mission-proof .stat-grid"),
            storyEyebrowTitle: gap(".about-story .eyebrow", ".about-story h2"),
            storyTitleCopy: gap(".about-story h2", ".about-story__copy"),
            teamEyebrowTitle: gap(".about-team .eyebrow", ".about-team h2"),
            teamHeaderGrid: teamGrid.top - teamHeader.bottom,
            valuesEyebrowTitle: gap(".about-values .eyebrow", ".about-values h2"),
            valuesTitleCopy: gap(".about-values h2", ".about-values__lead"),
          },
          quoteFits:
            quoteNode.scrollHeight <= quoteNode.clientHeight + 1
            && quoteNode.scrollWidth <= quoteNode.clientWidth + 1,
          grids: {
            teamWidth: teamGridNode.getBoundingClientRect().width,
            valuesWidth: valuesGridNode.getBoundingClientRect().width,
          },
          headingSizes: [
            ".about-mission h2",
            ".about-story h2",
            ".about-team h2",
            ".about-values h2",
          ].map((selector) => Number.parseFloat(getComputedStyle(node(selector)).fontSize)),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });

      const expectedTitleCopyGap = Math.min(Math.max(viewport.width * 0.015, 32), 48);
      const expectedGridGap = Math.min(Math.max(viewport.width * 0.03, 48), 64);

      sectionHeights.set(viewport.width, metrics.missionHeight);
      expect(metrics.gaps.missionEyebrowTitle).toBeCloseTo(20, 0);
      expect(metrics.gaps.storyEyebrowTitle).toBeCloseTo(20, 0);
      expect(metrics.gaps.teamEyebrowTitle).toBeCloseTo(20, 0);
      expect(metrics.gaps.valuesEyebrowTitle).toBeCloseTo(20, 0);
      expect(metrics.gaps.missionTitleCopy).toBeCloseTo(expectedTitleCopyGap, 0);
      expect(metrics.gaps.storyTitleCopy).toBeCloseTo(expectedTitleCopyGap, 0);
      expect(metrics.gaps.valuesTitleCopy).toBeCloseTo(expectedTitleCopyGap, 0);
      expect(metrics.gaps.missionQuoteStats).toBeCloseTo(48, 0);
      expect(metrics.gaps.teamHeaderGrid).toBeCloseTo(expectedGridGap, 0);
      expect(metrics.quoteFits).toBe(true);
      expect(metrics.grids.teamWidth).toBeLessThanOrEqual(1400);
      expect(metrics.grids.valuesWidth).toBeLessThanOrEqual(1400);
      expect(metrics.headingSizes.every((size) => size <= 72)).toBe(true);
      expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);

      if ([1920, 2560, 3440].includes(viewport.width)) {
        for (const section of ["mission", "story", "team", "values"]) {
          await page.locator(`.about-${section}-section`).screenshot({
            path: `output/screenshots/about-${section}-wide-${viewport.width}-final.png`,
          });
        }
      }

      await context.close();
    }

    expect(Math.abs((sectionHeights.get(1800) ?? 0) - (sectionHeights.get(1799) ?? 0))).toBeLessThan(5);
  });
});

test.describe("about page text containment", () => {
  test("keeps responsive desktop copy inside its intended widths", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive desktop viewport matrix.");

    for (const viewport of [
      { width: 1024, height: 900 },
      { width: 1280, height: 900 },
      { width: 1536, height: 960 },
      { width: 1799, height: 1000 },
      { width: 1800, height: 1000 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
      { width: 3440, height: 1440 },
      { width: 3840, height: 2160 },
    ]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const metrics = await page.evaluate(() => {
        const containmentTargets = [
          ".about-mission h2",
          ".mission-proof blockquote",
          ".about-mission__body--primary",
          ".about-mission__body--secondary",
          ".about-story h2",
          ".about-story__copy",
          ".about-story__copy p:nth-child(1)",
          ".about-story__copy p:nth-child(2)",
          ".about-story__copy p:nth-child(3)",
          ".about-team h2",
          ".about-team__lead",
          ".about-values h2",
          ".about-values__lead",
        ];
        const frameTargets = [
          [".about-team", ".about-team__lead"],
          [".about-values", ".about-values h2"],
          [".about-values", ".about-values__lead"],
        ];

        return {
          containment: containmentTargets.map((selector) => {
            const node = document.querySelector<HTMLElement>(selector);
            if (!node) throw new Error(`Missing About text target: ${selector}`);
            return {
              selector,
              clientHeight: node.clientHeight,
              clientWidth: node.clientWidth,
              scrollWidth: node.scrollWidth,
              overflowY: getComputedStyle(node).overflowY,
            };
          }),
          frames: frameTargets.map(([frameSelector, targetSelector]) => {
            const frame = document.querySelector<HTMLElement>(frameSelector);
            const target = document.querySelector<HTMLElement>(targetSelector);
            if (!frame || !target) {
              throw new Error(`Missing About frame pair: ${frameSelector} / ${targetSelector}`);
            }
            const frameRect = frame.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            return {
              targetSelector,
              leftOverflow: frameRect.left - targetRect.left,
              rightOverflow: targetRect.right - frameRect.right,
            };
          }),
        };
      });

      for (const metric of metrics.containment) {
        expect(metric.clientHeight, `${metric.selector} has natural height at ${viewport.width}px`).toBeGreaterThan(0);
        expect(metric.overflowY, `${metric.selector} does not clip text at ${viewport.width}px`).not.toBe("hidden");
        expect(
          metric.scrollWidth,
          `${metric.selector} horizontal text fit at ${viewport.width}px`,
        ).toBeLessThanOrEqual(metric.clientWidth + 1);
      }

      for (const frame of metrics.frames) {
        expect(
          frame.leftOverflow,
          `${frame.targetSelector} stays inside the shared left edge at ${viewport.width}px`,
        ).toBeLessThanOrEqual(1);
        expect(
          frame.rightOverflow,
          `${frame.targetSelector} stays inside the shared right edge at ${viewport.width}px`,
        ).toBeLessThanOrEqual(1);
      }

      await context.close();
    }
  });
});

test.describe("homepage mobile typography", () => {
  test("preserves the approved 390px line composition and type metrics", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs in its own Figma-sized viewport.");

    const context = await browser.newContext({
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await waitForBrandFonts(page);

    const expectedLines = [
      [
        ".home-hero__lead .copy-lines--mobile",
        "Connecting people, process, and technology\nfor real-time business — sustainably,\nstrategically, and with purpose.",
      ],
      [
        ".what-section h2",
        "We simplify the\ncomplex & create a\nclear path forward.",
      ],
      [
        ".expertise-sub .copy-lines--mobile",
        "We bring together best-in-class\ntechnologies and methodologies to take your\nsolutions from concept to marketplace.",
      ],
      [
        ".process-section__intro .copy-lines--mobile",
        "You have big ideas. We have a proven\nprocess to get you there quickly,\ncollaboratively, and with built-in learning\nat every step.",
      ],
      [
        ".proof-section h2",
        "Trusted by leaders\nwho think\ndifferently.",
      ],
      [
        ".proof-slide[data-proof-active] .proof-slide__mobile-quote",
        "I have a passion for finding innovative\nways to use technology. Working with\neCongruity as a strategic partner has\ncreated a path forward to new markets.",
      ],
      [
        ".about-closing h2",
        "Ready to build\nsomething that\nlasts?",
      ],
      [
        ".about-closing__body .copy-lines--mobile",
        "Whether you're navigating a strategic\nchallenge or launching something entirely\nnew — we're ready to build with you.",
      ],
    ] as const;

    for (const [selector, lines] of expectedLines) {
      const renderedLines = await page.locator(selector).evaluate((node) => (node as HTMLElement).innerText);
      expect(renderedLines, `${selector} line breaks`).toBe(lines);
    }

    const metrics = await page.evaluate(() => {
      const targets = [
        [".hero-kicker", "13px", "13px"],
        [".home-hero h1", "44px", "50px"],
        [".what-section h2", "40px", "46px"],
        [".what-section__body", "16px", "26.4px"],
        [".expertise-section h2", "40px", "46px"],
        [".expertise-sub", "15px", "23.25px"],
        [".process-section h2", "40px", "46px"],
        [".process-section__intro", "16px", "26.4px"],
        [".proof-section h2", "40px", "46px"],
        [".proof-slide[data-proof-active] blockquote p", "22px", "32px"],
        [".about-closing h2", "40px", "46px"],
      ] as const;

      return targets.map(([selector, expectedSize, expectedLineHeight]) => {
        const node = document.querySelector<HTMLElement>(selector);
        if (!node) throw new Error(`Missing mobile typography target: ${selector}`);
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          selector,
          expectedSize,
          expectedLineHeight,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          width: rect.width,
        };
      });
    });

    for (const metric of metrics) {
      expect(metric.fontSize, `${metric.selector} font size`).toBe(metric.expectedSize);
      expect(metric.lineHeight, `${metric.selector} line height`).toBe(metric.expectedLineHeight);
      expect(metric.width, `${metric.selector} stays inside the shared homepage hero column`).toBeLessThanOrEqual(326);
      expect(metric.width).toBeGreaterThan(0);
    }

    const titleLines = page.locator(
      ".home-hero__title-group--mobile .home-hero__title-line",
    );
    await expect(titleLines).toHaveCount(3);
    expect(
      await titleLines.evaluateAll((lines) =>
        lines.every((line) => line.scrollWidth <= line.clientWidth + 1),
      ),
    ).toBe(true);

    await context.close();
  });
});

test.describe("homepage section supporting copy", () => {
  test("matches the Figma desktop roles without overflowing their columns", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const metrics = await page
      .locator(".expertise-sub, .process-section__intro")
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const element = node as HTMLElement;
          const style = getComputedStyle(element);
          return {
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            fontWeight: style.fontWeight,
            fits: element.scrollWidth <= element.clientWidth + 1,
          };
        }),
      );

    expect(metrics).toEqual([
      {
        fontSize: "20px",
        lineHeight: "28px",
        fontWeight: "400",
        fits: true,
      },
      {
        fontSize: "18px",
        lineHeight: "30.6px",
        fontWeight: "400",
        fits: true,
      },
    ]);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const expertiseCopy = await page.locator(".expertise-sub .copy-lines--wide").evaluate((node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return {
        lines: new Set(Array.from(range.getClientRects(), (rect) => Math.round(rect.top))).size,
        text: (node as HTMLElement).innerText,
      };
    });

    expect(expertiseCopy.lines).toBe(3);
    expect(expertiseCopy.text).toBe(
      "We bring together best-in-class technologies and\nmethodologies to take your solutions\nfrom concept to marketplace.",
    );
  });

  test("keeps What We Do copy resilient across responsive layouts", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844, size: "16px", lineHeight: "26.4px" },
      { width: 1024, height: 875, size: "18px", lineHeight: "30.6px" },
      { width: 1280, height: 900, size: "18px", lineHeight: "30.6px" },
      { width: 1920, height: 1080, size: "18px", lineHeight: "30.6px" },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");

      const metric = await page.locator(".what-section-band").evaluate((section) => {
        const body = section.querySelector<HTMLElement>(".what-section__body");
        const cards = section.querySelector<HTMLElement>(".what-card-grid");
        if (!body || !cards) throw new Error("What We Do section is incomplete");

        const style = getComputedStyle(body);
        return {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          fontFamily: style.fontFamily,
          forcedLineWrappers: body.querySelectorAll(".copy-lines").length,
          bodyFits: body.scrollWidth <= body.clientWidth + 1,
          cardsContained: cards.scrollWidth <= cards.clientWidth + 1,
        };
      });

      expect(metric.fontSize).toBe(viewport.size);
      expect(metric.lineHeight).toBe(viewport.lineHeight);
      expect(metric.fontFamily).toContain("DM Sans");
      expect(metric.forcedLineWrappers).toBe(0);
      expect(metric.bodyFits).toBe(true);
      expect(metric.cardsContained).toBe(true);
    }
  });

  test("uses responsive gutters and uniform card geometry", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const viewport of [
      { width: 320, height: 844 },
      { width: 390, height: 844 },
      { width: 768, height: 900 },
      { width: 1024, height: 900 },
      { width: 1280, height: 720 },
      { width: 1536, height: 864 },
      { width: 1920, height: 1080 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await waitForBrandFonts(page);
      const frame = sharedContentFrame(viewport.width);
      await page.waitForFunction(({ x, width }) => {
        const grid = document.querySelector<HTMLElement>(".what-section");
        if (!grid) return false;
        const rect = grid.getBoundingClientRect();
        return Math.abs(rect.x - x) < 1 && Math.abs(rect.width - width) < 1;
      }, frame);

      const metric = await page.locator(".what-section-band").evaluate((section) => {
        const grid = section.querySelector<HTMLElement>(".what-section");
        const cards = Array.from(section.querySelectorAll<HTMLElement>(".what-card-item"));
        const visibleFaces = Array.from(
          section.querySelectorAll<HTMLElement>(".what-card__face--front"),
        );
        const backCopy = Array.from(
          section.querySelectorAll<HTMLElement>(".what-card__face--back p"),
        );
        if (!grid || cards.length !== 3) throw new Error("What We Do card grid is incomplete");

        const gridRect = grid.getBoundingClientRect();
        const cardRects = cards.map((card) => card.getBoundingClientRect());
        const faceRects = visibleFaces.map((face) => face.getBoundingClientRect());
        return {
          leftGutter: gridRect.left,
          rightGutter: document.documentElement.clientWidth - gridRect.right,
          cardWidths: cardRects.map((rect) => rect.width),
          cardHeights: cardRects.map((rect) => rect.height),
          faceWidths: faceRects.map((rect) => rect.width),
          faceHeights: faceRects.map((rect) => rect.height),
          faceGaps: faceRects.slice(1).map((rect, index) => rect.left - faceRects[index].right),
          backCopySizes: backCopy.map((copy) => Number.parseFloat(getComputedStyle(copy).fontSize)),
          facesFit: cards.every((card) =>
            Array.from(card.querySelectorAll<HTMLElement>(".what-card__face")).every(
              (face) =>
                face.scrollHeight <= face.clientHeight &&
                face.scrollWidth <= face.clientWidth,
            ),
          ),
        };
      });

      expect(metric.leftGutter).toBeCloseTo(frame.x, 0);
      expect(metric.rightGutter).toBeCloseTo(frame.x, 0);
      expect(Math.max(...metric.cardWidths) - Math.min(...metric.cardWidths)).toBeLessThan(1);
      expect(Math.max(...metric.cardHeights) - Math.min(...metric.cardHeights)).toBeLessThan(1);
      expect(Math.max(...metric.faceWidths) - Math.min(...metric.faceWidths)).toBeLessThan(1);
      expect(Math.max(...metric.faceHeights) - Math.min(...metric.faceHeights)).toBeLessThan(1);
      expect(Math.max(...metric.faceGaps) - Math.min(...metric.faceGaps)).toBeLessThan(1);
      expect(metric.facesFit).toBe(true);

      expect(metric.backCopySizes.every((size) => size >= 12)).toBe(true);
    }
  });

  test("keeps the What We Do cards beside the copy on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    const metric = await page.locator(".what-section-band").evaluate((section) => {
      const layout = section.querySelector<HTMLElement>(".what-section");
      const copy = section.querySelector<HTMLElement>(".what-section__copy");
      const cards = section.querySelector<HTMLElement>(".what-card-grid");
      if (!layout || !copy || !cards) throw new Error("What We Do section is incomplete");

      const sectionRect = section.getBoundingClientRect();
      const layoutRect = layout.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const cardsRect = cards.getBoundingClientRect();

      return {
        sectionHeight: sectionRect.height,
        layoutHeight: layoutRect.height,
        columns: getComputedStyle(layout).gridTemplateColumns.split(" ").length,
        copyBeforeCards: copyRect.right <= cardsRect.left + 1,
        copyOverlapsCardsVertically:
          copyRect.top < cardsRect.bottom && copyRect.bottom > cardsRect.top,
      };
    });

    expect(metric.columns).toBe(2);
    expect(metric.copyBeforeCards).toBe(true);
    expect(metric.copyOverlapsCardsVertically).toBe(true);
    expect(metric.sectionHeight).toBeLessThan(1000);
    expect(metric.layoutHeight).toBeLessThan(800);
  });

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

    for (const item of mobileNavItems) {
      await page.goto("/");
      await page.getByLabel("Open navigation").click();
      await primaryNav(page).getByRole("link", { name: item.name }).click();
      await expect(page).toHaveURL(item.path);
      await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    }
  });

  test("marks only Home active in the homepage mobile menu", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile drawer behavior.");

    await page.goto("/");
    await page.getByLabel("Open navigation").click();

    const nav = primaryNav(page);
    const home = nav.getByRole("link", { name: "Home" });
    const whatWeDo = nav.getByRole("link", { name: "What We Do" });

    await expect(nav.locator(".mobile-nav__link--active")).toHaveCount(1);
    await expect(home).toHaveAttribute("aria-current", "page");
    await expect(whatWeDo).not.toHaveAttribute("aria-current", "page");
    await expect(whatWeDo).not.toHaveClass(/mobile-nav__link--active/);
  });

  test("mobile navigation drawer remains usable after scrolling", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile drawer behavior.");

    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 720));
    await expect(page.locator(".site-header")).toHaveAttribute("data-scrolled", "");

    await page.getByLabel("Open navigation").click();
    await expect(page.locator(".site-header")).toHaveAttribute("data-mobile-nav-open", "");

    const drawerMetrics = await page.locator(".mobile-nav__panel").evaluate((panel) => {
      const rect = panel.getBoundingClientRect();
      const headerRect = document.querySelector(".site-header")?.getBoundingClientRect();

      return {
        bottom: Math.round(rect.bottom),
        headerBottom: Math.round(headerRect?.bottom ?? 0),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        viewportHeight: window.innerHeight,
      };
    });

    expect(drawerMetrics.top).toBe(drawerMetrics.headerBottom);
    expect(drawerMetrics.bottom).toBe(drawerMetrics.viewportHeight);
    expect(drawerMetrics.height).toBe(drawerMetrics.viewportHeight - drawerMetrics.headerBottom);

    await page.getByLabel("Open navigation").click();
    await expect(page.locator(".site-header")).not.toHaveAttribute("data-mobile-nav-open", "");
    await expect(page.locator(".mobile-nav__panel")).toBeHidden();
  });

  test("keeps the scrolled header free of divider lines and shadows", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 720);
    });

    const header = page.locator(".site-header");
    await expect(header).toHaveAttribute("data-scrolled", "");
    await expect(header).toHaveCSS("border-bottom-width", "0px");
    await expect(header).toHaveCSS("box-shadow", "none");
  });

  test("uses the homepage header dimensions on every top-level page", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own exact viewport matrix.");

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 744, height: 1024 },
      { width: 1920, height: 1080 },
    ]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      let homepageMetrics: Record<string, number> | undefined;

      for (const sitePage of pages) {
        await page.goto(sitePage.path);
        const metrics = await page.evaluate(() => {
          const header = document.querySelector<HTMLElement>(".site-header");
          const inner = document.querySelector<HTMLElement>(".site-header__inner");
          const logo = document.querySelector<HTMLElement>(".brand-link__logo");

          if (!header || !inner || !logo) {
            throw new Error("Shared header is incomplete");
          }

          const headerRect = header.getBoundingClientRect();
          const innerRect = inner.getBoundingClientRect();
          const logoRect = logo.getBoundingClientRect();

          return {
            headerHeight: headerRect.height,
            innerHeight: innerRect.height,
            logoX: logoRect.x,
            logoY: logoRect.y,
            logoWidth: logoRect.width,
            logoHeight: logoRect.height,
          };
        });

        homepageMetrics ??= metrics;
        expect(metrics).toEqual(homepageMetrics);
      }

      await context.close();
    }
  });
});

test.describe("home hero mountain background", () => {
  test("renders decorative mountain image and WebGL canvas without changing hero accessibility", async ({
    page,
  }) => {
    await page.goto("/");

    const hero = page.locator(".home-hero");
    await expect(hero).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Where Boundless Horizons Inspire Bold Innovation" })).toBeVisible();
    await expect(hero.locator(".home-hero__orbit")).toHaveCount(0);
    await expect(hero.locator(".home-hero__star")).toHaveCount(14);

    const image = hero.locator(".home-hero__mountain-image");
    await expect(image).toHaveAttribute("alt", "");
    await expect(image).toHaveAttribute("aria-hidden", "true");
    await expect(image).toHaveAttribute("src", "/images/brand/hero-mountain-range.png");

    const canvas = hero.locator("canvas[data-mountain-webgl]");
    await expect(canvas).toHaveAttribute("aria-hidden", "true");

    const isMobileViewport = (page.viewportSize()?.width ?? 0) < 768;

    if (isMobileViewport) {
      await expect(hero).toHaveAttribute("data-mountain-motion", "disabled");
      await expect(canvas).toHaveAttribute("hidden", "");
      return;
    }

    await expect(hero).toHaveAttribute("data-mountain-motion", "active");

    const canvasState = await canvas.evaluate((node: HTMLCanvasElement) => ({
      hasWebglDataAttribute: node.hasAttribute("data-mountain-webgl"),
      width: node.width,
      height: node.height,
      role: node.getAttribute("role"),
    }));

    expect(canvasState.hasWebglDataAttribute).toBe(true);
    expect(canvasState.width).toBeGreaterThan(0);
    expect(canvasState.height).toBeGreaterThan(0);
    expect(canvasState.role).toBeNull();
  });

  test("uses the Figma Client Stories link treatment", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop pointer behavior.");

    await page.setViewportSize({ width: 1536, height: 864 });
    await page.goto("/");

    const stories = page.locator(".home-hero .button-link--secondary");
    await expect(stories).toHaveText("See Client Stories");

    const spacing = await stories.evaluate((link) => {
      const style = getComputedStyle(link);
      return {
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
      };
    });

    expect(spacing.paddingTop).toBe("22px");
    expect(spacing.paddingBottom).toBe("5px");

    await stories.hover();
    await expect(stories).toHaveCSS("color", "rgb(200, 165, 90)");
    await expect(stories).toHaveCSS("border-bottom-color", "rgb(200, 165, 90)");
    await expect(stories).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });
});

test.describe("home expertise carousel", () => {
  test("shows one indicator per capability and allows every capability to be selected", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const slides = page.locator("[data-capability-slide]");
    const dots = page.locator("[data-capability-dot]");

    await expect(page.locator(".expertise-dot--decorative")).toHaveCount(0);
    await expect(slides).toHaveCount(8);
    await expect(dots).toHaveCount(await slides.count());

    for (let index = 0; index < (await dots.count()); index += 1) {
      await dots.nth(index).click();
      await expect(dots.nth(index)).toHaveAttribute("aria-current", "true");
      await expect(slides.nth(index)).toHaveAttribute("data-capability-active", /^(true)?$/);
      await expect(slides.nth(index)).toHaveAttribute("aria-hidden", "false");
    }
  });
});

test.describe("about navigation and hero", () => {
  test("uses the homepage hero type scale at every responsive breakpoint", async ({
    browser,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 744, height: 900 },
      { width: 1024, height: 900 },
      { width: 1280, height: 900 },
      { width: 1920, height: 1000 },
    ]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      const measurements = [];

      for (const config of [
        {
          path: "/",
          hero: ".home-hero",
          label: ".hero-kicker",
          title: "h1",
          lead: ".home-hero__lead",
        },
        {
          path: "/about/",
          hero: ".about-hero",
          label: ".eyebrow",
          title: "h1",
          lead: ".home-hero__lead",
        },
      ]) {
        await page.goto(config.path);
        await waitForBrandFonts(page);
        measurements.push(
          await page.locator(config.hero).evaluate((hero, selectors) => {
            const heroRect = hero.getBoundingClientRect();
            const metric = (selector: string) => {
              const node = hero.querySelector<HTMLElement>(selector);
              if (!node) throw new Error(`Missing hero type target: ${selector}`);
              const rect = node.getBoundingClientRect();
              const style = getComputedStyle(node);
              return {
                height: Math.round(rect.height * 100) / 100,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing,
              };
            };

            const lead = metric(selectors.lead);
            const title = metric(selectors.title);

            return {
              heroTop: Math.round(heroRect.y * 100) / 100,
              label: metric(selectors.label),
              title: {
                fontSize: title.fontSize,
                fontWeight: title.fontWeight,
                lineHeight: title.lineHeight,
                letterSpacing: title.letterSpacing,
              },
              lead: {
                fontSize: lead.fontSize,
                fontWeight: lead.fontWeight,
                lineHeight: lead.lineHeight,
                letterSpacing: lead.letterSpacing,
              },
            };
          }, config),
        );
      }

      expect(measurements[1]).toEqual(measurements[0]);
      await context.close();
    }
  });

  test("matches the approved responsive geometry at desktop, tablet, and mobile widths", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own exact viewport matrix.");

    const viewports = [
      {
        name: "desktop",
        width: 1920,
        height: 928,
        hero: { x: 0, y: 115, width: 1920, height: 724 },
        content: { x: 360, y: 174.5 },
        logo: { x: 89, y: 28, width: 212, height: 50 },
        fontSize: 120,
      },
      {
        name: "small-desktop",
        width: 1280,
        height: 748,
        hero: { x: 0, y: 115, width: 1280, height: 585 },
        content: { x: 240, y: 155 },
        logo: { x: 89, y: 28, width: 212, height: 50 },
        fontSize: 80,
      },
      {
        name: "tablet",
        width: 744,
        height: 603,
        hero: { x: 0, y: 56, width: 744, height: 515.58 },
        content: { x: 32, y: 108 },
        logo: { x: 32, y: 11.52, width: 140, height: 32.95 },
        fontSize: 46.4,
      },
      {
        name: "mobile",
        width: 390,
        height: 476,
        hero: { x: 0, y: 56, width: 390, height: 409 },
        content: { x: 32, y: 120 },
        logo: { x: 24, y: 11.52, width: 140, height: 32.95 },
        fontSize: 44,
      },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const hero = page.locator(".about-hero");
      const heading = hero.getByRole("heading", {
        level: 1,
        name: "Built on purpose. Driven by people.",
      });

      await expect(heading.locator(".about-hero__title-line")).toHaveCount(2);

      const metrics = await page.evaluate(() => {
        const heroNode = document.querySelector<HTMLElement>(".about-hero");
        const contentNode = document.querySelector<HTMLElement>(".about-hero .page-hero__inner");
        const headingNode = document.querySelector<HTMLElement>(".about-hero h1");
        const logoNode = document.querySelector<HTMLElement>(".site-header--about .brand-link__logo");

        if (!heroNode || !contentNode || !headingNode || !logoNode) {
          throw new Error("About hero is incomplete");
        }

        const heroRect = heroNode.getBoundingClientRect();
        const contentRect = contentNode.getBoundingClientRect();
        const logoRect = logoNode.getBoundingClientRect();

        return {
          hero: {
            x: heroRect.x,
            y: heroRect.y,
            width: heroRect.width,
            height: heroRect.height,
          },
          content: { x: contentRect.x, y: contentRect.y },
          logo: {
            x: logoRect.x,
            y: logoRect.y,
            width: logoRect.width,
            height: logoRect.height,
          },
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
          heroBackground: getComputedStyle(heroNode).backgroundColor,
          accentColor: getComputedStyle(
            headingNode.querySelector<HTMLElement>("em") ?? headingNode,
          ).color,
        };
      });

      expect(metrics.hero.x).toBeCloseTo(viewport.hero.x, 0);
      expect(metrics.hero.y).toBeCloseTo(viewport.hero.y, 0);
      expect(metrics.hero.width).toBeCloseTo(viewport.hero.width, 0);
      expect(metrics.hero.height).toBeCloseTo(viewport.hero.height, 0);
      expect(metrics.content.x).toBeCloseTo(viewport.content.x, 0);
      expect(metrics.content.y).toBeCloseTo(viewport.content.y, 0);
      expect(metrics.logo.x).toBeCloseTo(viewport.logo.x, 0);
      expect(metrics.logo.y).toBeCloseTo(viewport.logo.y, 0);
      expect(metrics.logo.width).toBeCloseTo(viewport.logo.width, 0);
      expect(metrics.logo.height).toBeCloseTo(viewport.logo.height, 0);
      expect(metrics.fontSize).toBe(viewport.fontSize);
      expect(metrics.heroBackground).toBe("rgb(17, 26, 16)");
      expect(metrics.accentColor).toBe("rgb(123, 160, 138)");

      await captureViewportScreenshot(
        page,
        `output/screenshots/about-nav-hero-${viewport.name}-final.png`,
      );

      await context.close();
    }
  });

  test("keeps the About navigation transparent, underline-free, and direction-aware", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop navigation behavior.");

    await page.goto("/about/");

    const header = page.locator(".site-header--about");
    const aboutLink = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", {
      name: "About",
    });

    await expect(header).toHaveCSS("background-color", "rgb(17, 26, 16)");
    await aboutLink.hover();
    await expect(aboutLink).toHaveCSS("color", "rgb(200, 165, 90)");

    const underlineDisplay = await aboutLink.evaluate((link) =>
      getComputedStyle(link, "::after").display,
    );
    expect(underlineDisplay).toBe("none");

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 500);
    });
    await expect(header).toHaveAttribute("data-hidden", "");

    await page.evaluate(() => window.scrollTo(0, 450));
    await expect(header).not.toHaveAttribute("data-hidden", "");
  });
});

test.describe("about mission", () => {
  test("matches the Figma geometry at desktop, tablet, and mobile widths", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own exact viewport matrix.");

    const viewports = [
      {
        name: "desktop",
        width: 1920,
        height: 928,
        section: { y: 849, height: 850 },
        inner: { x: 360, y: 126, width: 1200 },
        fontSize: 61.44,
      },
      {
        name: "small-desktop",
        width: 1280,
        height: 748,
        section: { y: 710, height: 850 },
        inner: { x: 240, y: 102.4, width: 800 },
        fontSize: 51.2,
      },
      {
        name: "tablet",
        width: 744,
        height: 603,
        section: { y: 571.58, height: 927.97 },
        inner: { x: 32, y: 100, width: 680 },
        fontSize: 44,
      },
      {
        name: "mobile",
        width: 390,
        height: 476,
        section: { y: 465, height: 955.75 },
        inner: { x: 32, y: 64, width: 326 },
        fontSize: 27.885,
      },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: {
          width: viewport.width,
          height: Math.ceil(viewport.section.y + viewport.section.height),
        },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const section = page.locator(".about-mission-section");
      const metrics = await section.evaluate((sectionNode) => {
        const innerNode = sectionNode.querySelector<HTMLElement>(".about-mission");
        const headingNode = sectionNode.querySelector<HTMLElement>("h2");

        if (!innerNode || !headingNode) {
          throw new Error("About mission is incomplete");
        }

        const sectionRect = sectionNode.getBoundingClientRect();
        const innerRect = innerNode.getBoundingClientRect();

        return {
          section: { y: sectionRect.y, height: sectionRect.height },
          previousBottom:
            sectionNode.previousElementSibling?.getBoundingClientRect().bottom ?? sectionRect.y,
          inner: {
            x: innerRect.x - sectionRect.x,
            y: innerRect.y - sectionRect.y,
            width: innerRect.width,
          },
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
        };
      });

      const isDesktop = viewport.width >= 1024;
      if (isDesktop) {
        expect(metrics.section.y).toBeGreaterThanOrEqual(metrics.previousBottom);
        expect(metrics.section.y - metrics.previousBottom).toBeLessThanOrEqual(10);
        expect(metrics.section.height).toBeGreaterThan(0);
      } else {
        expect(metrics.section.y).toBeCloseTo(viewport.section.y, 0);
        expect(metrics.section.height).toBeCloseTo(viewport.section.height, 0);
      }
      const frame = sharedContentFrame(viewport.width);
      expect(metrics.inner.x).toBeCloseTo(frame.x, 0);
      const sectionPadding = Math.min(Math.max(viewport.width * 0.07, 96), 144);
      if (isDesktop) {
        expect(Math.abs(metrics.inner.y - sectionPadding)).toBeLessThanOrEqual(1);
      } else {
        expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      }
      expect(metrics.inner.width).toBeCloseTo(frame.width, 0);
      expect(metrics.fontSize).toBe(isDesktop ? (viewport.width >= 1920 ? 64 : 48) : viewport.fontSize);

      await section.screenshot({
        path: `output/screenshots/about-mission-${viewport.name}-final.png`,
      });

      await context.close();
    }
  });
});

test.describe("about story", () => {
  test("matches the approved responsive Story geometry", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own exact viewport matrix.");

    const viewports = [
      {
        name: "desktop",
        width: 1920,
        section: { y: 1709, height: 1021.25 },
        inner: { x: 410, y: 140, width: 1100 },
        copy: { x: 410, y: 370.3 },
        timeline: { x: 1010, y: 140 },
        fontSize: 64,
      },
      {
        name: "small-desktop",
        width: 1280,
        section: { y: 1570, height: 1021.25 },
        inner: { x: 240, y: 102.4, width: 800 },
        copy: { x: 240, y: 0 },
        timeline: { x: 240, y: 0 },
        fontSize: 48,
      },
      {
        name: "tablet",
        width: 744,
        section: { y: 1499.55, height: 1251.69 },
        inner: { x: 64, y: 100, width: 616 },
        copy: { x: 64, y: 267.59 },
        timeline: { x: 64, y: 560.59 },
        fontSize: 64,
      },
      {
        name: "mobile",
        width: 390,
        section: { y: 1420.75, height: 1417.55 },
        inner: { x: 40, y: 64, width: 310 },
        copy: { x: 40, y: 212 },
        timeline: { x: 40, y: 618 },
        fontSize: 40,
      },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: {
          width: viewport.width,
          height: Math.ceil(viewport.section.y + viewport.section.height),
        },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const section = page.locator(".about-story-section");
      const metrics = await section.evaluate((sectionNode) => {
        const innerNode = sectionNode.querySelector<HTMLElement>(".about-story");
        const headingNode = sectionNode.querySelector<HTMLElement>("h2");
        const copyNode = sectionNode.querySelector<HTMLElement>(".about-story__copy");
        const timelineNode = sectionNode.querySelector<HTMLElement>(".story-timeline");

        if (!innerNode || !headingNode || !copyNode || !timelineNode) {
          throw new Error("About story is incomplete");
        }

        const sectionRect = sectionNode.getBoundingClientRect();
        const relativeRect = (node: HTMLElement) => {
          const rect = node.getBoundingClientRect();
          return {
            x: rect.x - sectionRect.x,
            y: rect.y - sectionRect.y,
            width: rect.width,
          };
        };

        return {
          section: { y: sectionRect.y, height: sectionRect.height },
          previousBottom:
            sectionNode.previousElementSibling?.getBoundingClientRect().bottom ?? sectionRect.y,
          inner: relativeRect(innerNode),
          copy: relativeRect(copyNode),
          timeline: relativeRect(timelineNode),
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
        };
      });

      const isDesktop = viewport.width >= 1024;
      if (isDesktop) {
        expect(metrics.section.y).toBeCloseTo(metrics.previousBottom, 0);
        expect(metrics.section.height).toBeGreaterThan(0);
      } else {
        expect(metrics.section.y).toBeCloseTo(viewport.section.y, 0);
        expect(metrics.section.height).toBeCloseTo(viewport.section.height, 0);
      }
      const frame = sharedContentFrame(viewport.width);
      expect(metrics.inner.x).toBeCloseTo(frame.x, 0);
      const sectionPadding = Math.min(Math.max(viewport.width * 0.07, 96), 144);
      if (isDesktop) {
        expect(Math.abs(metrics.inner.y - sectionPadding)).toBeLessThanOrEqual(1);
      } else {
        expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      }
      expect(metrics.inner.width).toBeCloseTo(frame.width, 0);
      expect(metrics.copy.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(metrics.copy.x + metrics.copy.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      if (isDesktop) {
        expect(metrics.copy.y).toBeGreaterThan(metrics.inner.y);
      } else {
        expect(metrics.copy.y).toBeCloseTo(viewport.copy.y, 0);
      }
      expect(metrics.timeline.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(metrics.timeline.x + metrics.timeline.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      if (viewport.width >= 1440) {
        expect(metrics.timeline.y).toBeCloseTo(metrics.inner.y, 0);
      } else if (isDesktop) {
        expect(metrics.timeline.y).toBeGreaterThan(metrics.copy.y);
      } else {
        expect(metrics.timeline.y).toBeCloseTo(viewport.timeline.y, 0);
      }
      expect(metrics.fontSize).toBe(isDesktop ? (viewport.width >= 1920 ? 64 : 48) : viewport.fontSize);

      await section.screenshot({
        path: `output/screenshots/about-story-${viewport.name}-final.png`,
      });

      await context.close();
    }
  });

  test("hides the final title separator on compact screens and keeps the title contained", async ({
    browser,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    for (const width of [320, 390, 744, 1280]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: { width, height: 1600 },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const finalItem = page.locator(".story-timeline li:last-child");
      const title = finalItem.getByRole("heading", { level: 3 });

      await expect(title).toBeVisible();

      const metrics = await finalItem.evaluate((itemNode) => {
        const titleNode = itemNode.querySelector<HTMLElement>("h3");
        const separatorNode = itemNode.querySelector<HTMLElement>(
          ".story-timeline__title-separator",
        );
        const bodyNode = itemNode.querySelector<HTMLElement>(".story-timeline__body");
        const sectionNode = itemNode.closest<HTMLElement>(".about-story-section");

        if (!titleNode || !separatorNode || !bodyNode || !sectionNode) {
          throw new Error("Final timeline item is incomplete");
        }

        const itemRect = itemNode.getBoundingClientRect();
        const titleRect = titleNode.getBoundingClientRect();
        const bodyRect = bodyNode.getBoundingClientRect();
        const sectionRect = sectionNode.getBoundingClientRect();

        return {
          titleLeft: titleRect.left,
          titleRight: titleRect.right,
          itemLeft: itemRect.left,
          itemRight: itemRect.right,
          titleScrollWidth: titleNode.scrollWidth,
          titleClientWidth: titleNode.clientWidth,
          titleText: titleNode.innerText.replace(/\s+/g, " ").trim(),
          separatorDisplay: getComputedStyle(separatorNode).display,
          bodyTop: bodyRect.top,
          titleBottom: titleRect.bottom,
          bodyBottom: bodyRect.bottom,
          sectionBottom: sectionRect.bottom,
        };
      });

      expect(metrics.titleLeft).toBeGreaterThanOrEqual(metrics.itemLeft - 1);
      expect(metrics.titleRight).toBeLessThanOrEqual(metrics.itemRight + 1);
      expect(metrics.titleScrollWidth).toBeLessThanOrEqual(metrics.titleClientWidth + 1);
      expect(metrics.titleText).toBe(
        width <= 1023
          ? "Inspired by the Frontier Driven by Innovation"
          : "Inspired by the Frontier × Driven by Innovation",
      );
      expect(metrics.separatorDisplay).toBe(width <= 1023 ? "none" : "inline");
      expect(metrics.bodyTop).toBeGreaterThan(metrics.titleBottom);
      expect(metrics.bodyBottom).toBeLessThanOrEqual(metrics.sectionBottom);

      await context.close();
    }
  });
});

test.describe("about team", () => {
  test("matches the approved responsive Team grid", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own exact viewport matrix.");

    const viewports = [
      {
        name: "desktop",
        width: 1920,
        section: { y: 2740.25, height: 1560.19 },
        inner: { x: 410, y: 141, width: 1100 },
        grid: { x: 410, y: 396.19, width: 1100 },
        card: { width: 350.67, height: 500 },
        image: { width: 348.67, height: 348.66 },
        fontSize: 64,
      },
      {
        name: "small-desktop",
        width: 1280,
        section: { y: 2601.25, height: 1560.19 },
        inner: { x: 240, y: 103.4, width: 800 },
        grid: { x: 240, y: 0, width: 800 },
        card: { width: 350.67, height: 500 },
        image: { width: 348.67, height: 348.66 },
        fontSize: 48,
      },
      {
        name: "tablet",
        width: 744,
        section: { y: 2751.24, height: 1800.17 },
        inner: { x: 64, y: 100, width: 616 },
        grid: { x: 64, y: 460.38, width: 616 },
        card: { width: 299, height: 399.28 },
        image: { width: 297, height: 312.63 },
        fontSize: 64,
      },
      {
        name: "mobile",
        width: 390,
        section: { y: 2838.3, height: 1168.02 },
        inner: { x: 40, y: 64, width: 310 },
        grid: { x: 40, y: 364.25, width: 310 },
        card: { width: 149, height: 230 },
        image: { width: 147, height: 154.74 },
        fontSize: 40,
      },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: {
          width: viewport.width,
          height: Math.ceil(viewport.section.y + viewport.section.height),
        },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const section = page.locator(".about-team-section");
      const metrics = await section.evaluate((sectionNode) => {
        const innerNode = sectionNode.querySelector<HTMLElement>(".about-team");
        const gridNode = sectionNode.querySelector<HTMLElement>(".team-grid");
        const cardNode = sectionNode.querySelector<HTMLElement>(".founder-card__button");
        const imageNode = sectionNode.querySelector<HTMLElement>(".founder-card__image");
        const headingNode = sectionNode.querySelector<HTMLElement>("h2");

        if (!innerNode || !gridNode || !cardNode || !imageNode || !headingNode) {
          throw new Error("About team is incomplete");
        }

        const sectionRect = sectionNode.getBoundingClientRect();
        const gridRect = gridNode.getBoundingClientRect();
        const relativeRect = (node: HTMLElement) => {
          const rect = node.getBoundingClientRect();
          return {
            x: rect.x - sectionRect.x,
            y: rect.y - sectionRect.y,
            width: rect.width,
            height: rect.height,
          };
        };

        const cards = Array.from(
          sectionNode.querySelectorAll<HTMLElement>(".founder-card__button"),
        ).map((buttonNode) => {
          const cardRect = buttonNode.getBoundingClientRect();
          const image = buttonNode.querySelector<HTMLElement>(".founder-card__image");
          const caption = buttonNode.querySelector<HTMLElement>(".founder-card__caption");

          if (!image || !caption) throw new Error("About team card is incomplete");

          const imageRect = image.getBoundingClientRect();
          const captionRect = caption.getBoundingClientRect();

          return {
            y: cardRect.y - gridRect.y,
            width: cardRect.width,
            height: cardRect.height,
            image: {
              y: imageRect.y - cardRect.y,
              width: imageRect.width,
              height: imageRect.height,
            },
            caption: {
              y: captionRect.y - cardRect.y,
              width: captionRect.width,
              height: captionRect.height,
            },
          };
        });

        return {
          section: { y: sectionRect.y, height: sectionRect.height },
          previousBottom:
            sectionNode.previousElementSibling?.getBoundingClientRect().bottom ?? sectionRect.y,
          inner: relativeRect(innerNode),
          grid: relativeRect(gridNode),
          card: relativeRect(cardNode),
          image: relativeRect(imageNode),
          cards,
          columnCount: getComputedStyle(gridNode).gridTemplateColumns.split(" ").length,
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
        };
      });

      const isDesktop = viewport.width >= 1024;
      if (isDesktop) {
        expect(metrics.section.y).toBeCloseTo(metrics.previousBottom, 0);
        expect(metrics.section.height).toBeGreaterThan(0);
      } else {
        expect(metrics.section.y).toBeCloseTo(viewport.section.y, 0);
        expect(metrics.section.height).toBeCloseTo(viewport.section.height, 0);
      }
      const frame = sharedContentFrame(viewport.width);
      expect(metrics.inner.x).toBeCloseTo(frame.x, 0);
      const sectionPadding = Math.min(Math.max(viewport.width * 0.07, 96), 144);
      if (isDesktop) {
        expect(Math.abs(metrics.inner.y - sectionPadding)).toBeLessThanOrEqual(1);
      } else {
        expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      }
      expect(metrics.inner.width).toBeCloseTo(frame.width, 0);
      expect(metrics.grid.x).toBeGreaterThanOrEqual(frame.x - 1);
      if (isDesktop) {
        expect(metrics.grid.y).toBeGreaterThan(metrics.inner.y);
        expect(metrics.columnCount).toBe(viewport.width >= 1440 ? 3 : 2);
      } else {
        expect(metrics.grid.y).toBeCloseTo(viewport.grid.y, 0);
      }
      expect(metrics.grid.x + metrics.grid.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      expect(metrics.fontSize).toBe(isDesktop ? (viewport.width >= 1920 ? 64 : 48) : viewport.fontSize);

      for (const card of metrics.cards) {
        expect(card.width).toBeCloseTo(metrics.cards[0].width, 1);
        expect(card.height).toBeCloseTo(metrics.cards[0].height, 1);
        expect(card.image.y).toBeCloseTo(metrics.cards[0].image.y, 1);
        expect(card.image.width).toBeCloseTo(metrics.cards[0].image.width, 1);
        expect(card.image.height).toBeCloseTo(metrics.cards[0].image.height, 1);
        expect(card.caption.y).toBeCloseTo(metrics.cards[0].caption.y, 1);
        expect(card.caption.width).toBeCloseTo(metrics.cards[0].caption.width, 1);
        expect(card.caption.height).toBeCloseTo(metrics.cards[0].caption.height, 1);
      }

      for (let index = 0; index < metrics.cards.length; index += metrics.columnCount) {
        const row = metrics.cards.slice(index, index + metrics.columnCount);
        for (const card of row) expect(card.y).toBeCloseTo(row[0].y, 2);
      }

      await section.screenshot({
        path: `output/screenshots/about-team-${viewport.name}-final.png`,
      });

      await context.close();
    }
  });

  test("keeps every mobile quote inside its flipped card", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own mobile viewport.");

    const context = await browser.newContext({
      deviceScaleFactor: 1,
      hasTouch: true,
      isMobile: true,
      reducedMotion: "reduce",
      viewport: { width: 390, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto("/about/");

    const cards = page.locator("[data-team-card]");
    await expect(cards).toHaveCount(6);

    await cards.first().scrollIntoViewIfNeeded();
    await cards.first().tap();
    await expect(cards.first()).toHaveAttribute("data-flipped", "");
    await expect(cards.first()).toHaveAttribute("aria-pressed", "true");
    await cards.nth(1).evaluate((button: HTMLButtonElement) => button.click());
    await expect(cards.first()).not.toHaveAttribute("data-flipped", "");
    await expect(cards.first()).toHaveAttribute("aria-pressed", "false");
    await expect(cards.nth(1)).toHaveAttribute("data-flipped", "");
    await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "true");
    await cards.nth(1).evaluate((button: HTMLButtonElement) => button.click());
    await expect(cards.nth(1)).not.toHaveAttribute("data-flipped", "");
    await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "false");

    await cards.first().tap();
    await expect(cards.first()).toHaveAttribute("data-flipped", "");
    await expect(cards.first()).toHaveAttribute("aria-pressed", "true");

    await cards.evaluateAll((buttons) => {
      for (const button of buttons) button.setAttribute("data-flipped", "");
    });

    const metrics = await cards.evaluateAll((buttons) =>
      buttons.map((button, index) => {
        const back = button.querySelector<HTMLElement>(".founder-card__face--back");
        const quote = button.querySelector<HTMLElement>(".founder-card__quote");
        const quoteMark = button.querySelector<HTMLElement>(".founder-card__quote-mark");
        const divider = button.querySelector<HTMLElement>(".founder-card__divider");
        const name = button.querySelector<HTMLElement>(".founder-card__face--back .founder-card__name");
        const meta = button.querySelector<HTMLElement>(".founder-card__face--back .content-card__meta");

        if (!back || !quote || !quoteMark || !divider || !name || !meta) {
          throw new Error(`About team card ${index + 1} is incomplete`);
        }

        const backRect = back.getBoundingClientRect();
        const quoteRect = quote.getBoundingClientRect();

        return {
          index,
          height: backRect.height,
          contentTop: quoteRect.top - backRect.top,
          contentBottom: quoteRect.bottom - backRect.top,
          quoteMarkDisplay: getComputedStyle(quoteMark).display,
          dividerDisplay: getComputedStyle(divider).display,
          nameDisplay: getComputedStyle(name).display,
          metaDisplay: getComputedStyle(meta).display,
        };
      }),
    );

    for (const card of metrics) {
      expect(card.contentTop, `card ${card.index + 1} content starts inside the back face`).toBeGreaterThanOrEqual(0);
      expect(card.contentBottom, `card ${card.index + 1} content ends inside the back face`).toBeLessThanOrEqual(card.height);
      expect(card.quoteMarkDisplay, `card ${card.index + 1} hides the mobile quote mark`).toBe("none");
      expect(card.dividerDisplay, `card ${card.index + 1} hides the mobile divider`).toBe("none");
      expect(card.nameDisplay, `card ${card.index + 1} hides the repeated mobile name`).toBe("none");
      expect(card.metaDisplay, `card ${card.index + 1} hides the repeated mobile role`).toBe("none");
    }

    await page.locator(".about-team-section").screenshot({
      path: "output/screenshots/about-team-mobile-quotes-final.png",
    });

    await context.close();
  });
});

test.describe("about values", () => {
  test("matches the Figma Values geometry at desktop, tablet, and mobile widths", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    const viewports = [
      {
        name: "desktop",
        width: 1280,
        sectionHeight: 1241.38,
        container: { x: 240, y: 102.4, width: 800 },
        label: { y: 102.4, size: 18, line: 23, tracking: 5.4 },
        heading: { y: 145.4, size: 48, line: 52.8 },
        lead: { y: 222.2, width: 520, size: 16, line: 24.8 },
        grid: { y: 360.6, width: 800, height: 1136, columns: 2, gap: 16 },
        cards: { width: 392, heights: [368, 368, 368, 368, 368, 368] },
        cardType: { number: 48, title: 25.6, body: 16, bodyLine: 28.8 },
      },
      {
        name: "tablet",
        width: 744,
        sectionHeight: 1295.45,
        container: { x: 64, y: 100, width: 616 },
        label: { y: 100, size: 18, line: 18, tracking: 5.4 },
        heading: { y: 146, size: 64, line: 73.6 },
        lead: { y: 313.19, width: 480, size: 16, line: 24.8 },
        grid: { y: 435.58, width: 616, height: 759.88, columns: 2, gap: 16 },
        cards: { width: 300, heights: [242.63, 242.63, 242.63, 242.63, 242.63, 242.63] },
        cardType: { number: 35, title: 22.4, body: 14, bodyLine: 21.7 },
      },
      {
        name: "mobile",
        width: 390,
        sectionHeight: 1708.06,
        container: { x: 40, y: 64, width: 310 },
        label: { y: 64, size: 14, line: 14, tracking: 4.2 },
        heading: { y: 98, size: 40, line: 46 },
        lead: { y: 212, width: 310, size: 15, line: 23.25 },
        grid: { y: 341, width: 310, height: 1303.02, columns: 1, gap: 14 },
        cards: { width: 310, heights: [191.55, 212.48, 212.48, 191.55, 212.48, 212.48] },
        cardType: { number: 28, title: 19, body: 13.5, bodyLine: 20.925 },
      },
    ] as const;

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: { width: viewport.width, height: 1000 },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const metrics = await page.locator(".about-values-section").evaluate((section) => {
        const sectionRect = section.getBoundingClientRect();
        const relativeMetric = (selector: string) => {
          const node = section.querySelector<HTMLElement>(selector);
          if (!node) throw new Error(`Missing About Values target: ${selector}`);
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            x: rect.x - sectionRect.x,
            y: rect.y - sectionRect.y,
            width: rect.width,
            height: rect.height,
            fontSize: Number.parseFloat(style.fontSize),
            lineHeight: style.lineHeight === "normal" ? rect.height : Number.parseFloat(style.lineHeight),
            tracking: Number.parseFloat(style.letterSpacing),
          };
        };

        const grid = section.querySelector<HTMLElement>(".values-grid");
        if (!grid) throw new Error("Missing About Values grid");
        const gridStyle = getComputedStyle(grid);

        return {
          sectionY: sectionRect.y,
          sectionHeight: sectionRect.height,
          previousBottom:
            section.previousElementSibling?.getBoundingClientRect().bottom ?? sectionRect.y,
          container: relativeMetric(".about-values"),
          label: relativeMetric(".eyebrow"),
          heading: relativeMetric("h2"),
          lead: relativeMetric(".about-values__lead"),
          grid: {
            ...relativeMetric(".values-grid"),
            columns: gridStyle.gridTemplateColumns.split(" ").length,
            gap: Number.parseFloat(gridStyle.gap),
          },
          cards: Array.from(section.querySelectorAll<HTMLElement>(".values-grid li")).map((card) => ({
            width: card.getBoundingClientRect().width,
            height: card.getBoundingClientRect().height,
          })),
          cardType: {
            number: relativeMetric(".values-grid span").fontSize,
            title: relativeMetric(".values-grid h3").fontSize,
            body: relativeMetric(".values-grid li p").fontSize,
            bodyLine: relativeMetric(".values-grid li p").lineHeight,
          },
        };
      });

      const isDesktop = viewport.width >= 1024;
      if (isDesktop) {
        expect(metrics.sectionY).toBeCloseTo(metrics.previousBottom, 0);
        expect(metrics.sectionHeight).toBeGreaterThan(0);
      } else {
        expect(metrics.sectionHeight).toBeCloseTo(viewport.sectionHeight, 0);
      }
      const frame = sharedContentFrame(viewport.width);
      expect(metrics.container.x).toBeCloseTo(frame.x, 0);
      const sectionPadding = Math.min(Math.max(viewport.width * 0.07, 96), 144);
      expect(metrics.container.y).toBeCloseTo(isDesktop ? sectionPadding : viewport.container.y, 0);
      expect(metrics.container.width).toBeCloseTo(frame.width, 0);
      expect(metrics.label.y).toBeCloseTo(isDesktop ? metrics.container.y : viewport.label.y, 0);
      expect(metrics.label.fontSize).toBe(viewport.label.size);
      expect(metrics.label.lineHeight).toBeCloseTo(isDesktop ? 22.5 : viewport.label.line, 1);
      expect(metrics.label.tracking).toBe(viewport.label.tracking);
      if (isDesktop) {
        expect(metrics.heading.y - (metrics.label.y + metrics.label.height)).toBeCloseTo(20, 0);
      } else {
        expect(metrics.heading.y).toBeCloseTo(viewport.heading.y, 0);
      }
      expect(metrics.heading.fontSize).toBe(viewport.heading.size);
      expect(metrics.heading.lineHeight).toBe(isDesktop ? 51.84 : viewport.heading.line);
      if (isDesktop) {
        expect(metrics.lead.y - (metrics.heading.y + metrics.heading.height)).toBeCloseTo(32, 0);
      } else {
        expect(metrics.lead.y).toBeCloseTo(viewport.lead.y, 0);
      }
      if (isDesktop) {
        expect(metrics.lead.width).toBeGreaterThan(0);
        expect(metrics.lead.width).toBeLessThanOrEqual(frame.width);
      } else {
        expect(metrics.lead.width).toBeCloseTo(
          viewport.name === "mobile" ? frame.width : viewport.lead.width,
          0,
        );
      }
      expect(metrics.lead.fontSize).toBe(viewport.lead.size);
      expect(metrics.lead.lineHeight).toBe(viewport.lead.line);
      if (isDesktop) {
        expect(metrics.grid.y - (metrics.lead.y + metrics.lead.height)).toBeCloseTo(48, 0);
      } else {
        expect(metrics.grid.y).toBeCloseTo(viewport.grid.y, 0);
      }
      expect(metrics.grid.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(metrics.grid.x + metrics.grid.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      expect(metrics.grid.height).toBeGreaterThan(0);
      expect(metrics.grid.columns).toBe(viewport.grid.columns);
      expect(metrics.grid.gap).toBe(viewport.grid.gap);
      expect(metrics.cardType).toEqual(viewport.cardType);

      for (const [index, card] of metrics.cards.entries()) {
        expect(card.width).toBeCloseTo(metrics.cards[index % viewport.grid.columns].width, 0);
        expect(card.height).toBeGreaterThan(0);
      }

      const valuesSection = page.locator(".about-values-section");
      await valuesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await page.addStyleTag({
        content: ".site-header, .skip-link { display: none !important; }",
      });
      await valuesSection.screenshot({
        path: `output/screenshots/about-values-${viewport.name}-final.png`,
      });

      await context.close();
    }
  });
});

test.describe("about closing CTA and footer", () => {
  test("keeps the Home and About footers visually identical", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 744, height: 1024 },
      { width: 1280, height: 900 },
      { width: 1920, height: 1080 },
    ]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      const pageMetrics = [];

      for (const path of ["/", "/about/"]) {
        await page.goto(path);
        await waitForBrandFonts(page);
        pageMetrics.push(
          await page.locator(".site-footer").evaluate((footer) => {
            const footerRect = footer.getBoundingClientRect();
            const grid = footer.querySelector<HTMLElement>(".site-footer__grid");
            if (!grid) throw new Error("Site footer grid is missing");

            const gridRect = grid.getBoundingClientRect();
            return {
              height: footerRect.height,
              grid: {
                x: gridRect.x,
                width: gridRect.width,
                height: gridRect.height,
              },
              items: Array.from(grid.children).map((item) => {
                const rect = item.getBoundingClientRect();
                const display = getComputedStyle(item).display;
                const text = item.textContent?.replace(/\s+/g, " ").trim();

                if (display === "none") return { display, text };

                return {
                  display,
                  text,
                  x: rect.x,
                  y: rect.y - footerRect.y,
                  width: rect.width,
                  height: rect.height,
                };
              }),
            };
          }),
        );
      }

      expect(pageMetrics[1]).toEqual(pageMetrics[0]);
      await context.close();
    }
  });

  test("keeps the Home and About closing CTAs visually identical", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 744, height: 900 },
      { width: 390, height: 844 },
    ]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      const pageMetrics = [];

      for (const path of ["/", "/about/"]) {
        await page.goto(path);
        pageMetrics.push(
          await page.locator(".about-closing-section").evaluate((section) => {
            const sectionRect = section.getBoundingClientRect();
            const metric = (selector: string) => {
              const node = section.querySelector<HTMLElement>(selector);
              if (!node) throw new Error(`Missing closing CTA target: ${selector}`);
              const rect = node.getBoundingClientRect();
              const style = getComputedStyle(node);
              return {
                x: Math.round((rect.x - sectionRect.x) * 100) / 100,
                y: Math.round((rect.y - sectionRect.y) * 100) / 100,
                width: Math.round(rect.width * 100) / 100,
                height: Math.round(rect.height * 100) / 100,
                fontSize: style.fontSize,
                lineHeight: style.lineHeight,
                color: style.color,
              };
            };

            const rings = section.querySelector<HTMLElement>(".about-closing__rings");
            const ringDisplay = rings ? getComputedStyle(rings).display : null;

            return {
              sectionHeight: Math.round(sectionRect.height * 100) / 100,
              inner: metric(".about-closing"),
              label: metric(".eyebrow"),
              heading: metric("h2"),
              body: metric(".about-closing__body"),
              actions: metric(".button-row"),
              primary: metric(".button-link--primary"),
              secondary: metric(".button-link--secondary"),
              headingText: section.querySelector<HTMLElement>("h2")?.innerText,
              bodyText: section.querySelector<HTMLElement>(".about-closing__body")?.innerText,
              rings: rings
                ? ringDisplay === "none"
                  ? { count: rings.children.length, display: ringDisplay }
                  : {
                      count: rings.children.length,
                      display: ringDisplay,
                      ...metric(".about-closing__rings"),
                    }
                : null,
            };
          }),
        );
      }

      expect(pageMetrics[0]).toEqual(pageMetrics[1]);
      await context.close();
    }
  });

  test("matches the Figma geometry and line composition at desktop, tablet, and mobile widths", async ({
    browser,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own responsive viewport matrix.");

    const viewports = [
      {
        name: "desktop",
        width: 1280,
        sectionHeight: 686.29,
        inner: { x: 410, y: 160, width: 460 },
        heading: { y: 202.3, size: 64, line: 73.6 },
        body: { x: 400, y: 368.79, width: 480, size: 16, line: 27.2 },
        actionsY: 448.59,
        ring: null,
      },
      {
        name: "tablet",
        width: 744,
        sectionHeight: 602,
        inner: { x: 64, y: 140, width: 616 },
        heading: { y: 186, size: 64, line: 73.6 },
        body: { x: 132, y: 361.2, width: 480, size: 16, line: 24 },
        actionsY: 457.2,
        ring: { x: 22, y: -26.86, width: 700 },
      },
      {
        name: "mobile",
        width: 390,
        sectionHeight: 529.94,
        inner: { x: 40, y: 64, width: 310 },
        heading: { y: 98, size: 40, line: 46 },
        body: { x: 40, y: 258, width: 310, size: 15, line: 23.25 },
        actionsY: 363.75,
        ring: { x: -45, y: 24.97, width: 480 },
      },
    ] as const;

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: { width: viewport.width, height: 900 },
      });
      const page = await context.newPage();
      await page.goto("/about/");
      await waitForBrandFonts(page);

      const metrics = await page.locator(".about-closing-section--about").evaluate((section) => {
        const sectionRect = section.getBoundingClientRect();
        const relativeMetric = (selector: string) => {
          const node = section.querySelector<HTMLElement>(selector);
          if (!node) throw new Error(`Missing About closing target: ${selector}`);
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            x: rect.x - sectionRect.x,
            y: rect.y - sectionRect.y,
            width: rect.width,
            height: rect.height,
            fontSize: Number.parseFloat(style.fontSize),
            lineHeight: Number.parseFloat(style.lineHeight),
          };
        };

        const heading = section.querySelector<HTMLElement>("h2");
        const body = section.querySelector<HTMLElement>(".about-closing__body");
        const ring = section.querySelector<HTMLElement>(".about-closing__rings");
        const footer = document.querySelector<HTMLElement>(".site-footer");
        if (!heading || !body || !ring || !footer) throw new Error("About closing section is incomplete");

        return {
          sectionHeight: sectionRect.height,
          inner: relativeMetric(".about-closing"),
          heading: relativeMetric("h2"),
          body: relativeMetric(".about-closing__body"),
          actions: relativeMetric(".button-row"),
          ring: getComputedStyle(ring).display === "none" ? null : relativeMetric(".about-closing__rings"),
          headingText: heading.innerText,
          bodyText: body.innerText,
          footerHeight: footer.getBoundingClientRect().height,
          footerBackground: getComputedStyle(footer).backgroundColor,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
        };
      });

      expect(metrics.sectionHeight).toBeCloseTo(viewport.sectionHeight, 0);
      const frame = sharedContentFrame(viewport.width);
      expect(metrics.inner.x).toBeCloseTo(frame.x, 0);
      expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      expect(metrics.inner.width).toBeCloseTo(frame.width, 0);
      expect(metrics.heading.y).toBeCloseTo(viewport.heading.y, 0);
      expect(metrics.heading.fontSize).toBe(viewport.heading.size);
      expect(metrics.heading.lineHeight).toBe(viewport.heading.line);
      expect(metrics.heading.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(metrics.heading.x + metrics.heading.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      expect(metrics.body.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(metrics.body.y).toBeCloseTo(viewport.body.y, 0);
      expect(metrics.body.x + metrics.body.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      expect(metrics.body.fontSize).toBe(viewport.body.size);
      expect(metrics.body.lineHeight).toBe(viewport.body.line);
      expect(metrics.actions.y).toBeCloseTo(viewport.actionsY, 0);
      expect(metrics.headingText).toBe(
        viewport.name === "mobile"
          ? "Ready to build\nsomething that\nlasts?"
          : "Ready to build\nsomething that lasts?",
      );
      expect(metrics.bodyText).toBe(
        viewport.name === "mobile"
          ? "Whether you're navigating a strategic\nchallenge or launching something entirely\nnew — we're ready to build with you."
          : "Whether you're navigating a strategic challenge or launching\nsomething entirely new — we're ready to build with you.",
      );
      expect(metrics.footerHeight).toBeGreaterThan(0);
      expect(metrics.footerBackground).toBe("rgb(17, 26, 16)");
      expect(metrics.overflow).toBeLessThanOrEqual(0);

      if (viewport.ring) {
        expect(metrics.ring).not.toBeNull();
        expect(metrics.ring?.x).toBeCloseTo(viewport.ring.x, 0);
        expect(metrics.ring?.y).toBeCloseTo(viewport.ring.y, 0);
        expect(metrics.ring?.width).toBeCloseTo(viewport.ring.width, 0);
      } else {
        expect(metrics.ring).toBeNull();
      }

      await context.close();
    }
  });

  test("keeps the approved gold hover treatment", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop pointer behavior.");

    await page.goto("/about/");
    const primary = page.locator(".about-closing-section--about .button-link--primary");
    const secondary = page.locator(".about-closing-section--about .button-link--secondary");

    await primary.hover();
    await expect(primary).toHaveCSS("background-color", "rgb(200, 165, 90)");
    await expect(primary).toHaveCSS("color", "rgb(30, 58, 30)");

    await secondary.hover();
    await expect(secondary).toHaveCSS("color", "rgb(200, 165, 90)");
    await expect(secondary).toHaveCSS("border-bottom-color", "rgb(200, 165, 90)");
  });
});

test.describe("home mobile detail cards", () => {
  test("keeps tap-for-details cards compact with both faces contained", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own mobile viewport matrix.");

    for (const width of [320, 390]) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        hasTouch: true,
        isMobile: true,
        reducedMotion: "reduce",
        viewport: { width, height: 844 },
      });
      const page = await context.newPage();
      await page.goto("/");

      const cards = page.locator(".what-card");
      await expect(cards).toHaveCount(3);

      const metrics = await cards.evaluateAll((nodes) =>
        nodes.map((card) => {
          const inner = card.querySelector<HTMLElement>(".what-card__inner");
          const front = card.querySelector<HTMLElement>(".what-card__face--front");
          const back = card.querySelector<HTMLElement>(".what-card__face--back");
          const frontNumber = front?.querySelector<HTMLElement>("span");
          const frontTitle = front?.querySelector<HTMLElement>("h3");
          if (!inner || !front || !back || !frontNumber || !frontTitle) {
            throw new Error("Incomplete mobile detail card");
          }

          const numberRect = frontNumber.getBoundingClientRect();
          const titleRect = frontTitle.getBoundingClientRect();

          return {
            cardHeight: card.getBoundingClientRect().height,
            innerHeight: inner.getBoundingClientRect().height,
            frontHeight: front.getBoundingClientRect().height,
            backHeight: back.getBoundingClientRect().height,
            frontFits: front.scrollHeight <= front.clientHeight,
            backFits: back.scrollHeight <= back.clientHeight,
            frontCenterDelta: Math.abs(
              numberRect.top + numberRect.height / 2 - (titleRect.top + titleRect.height / 2),
            ),
          };
        }),
      );

      for (const metric of metrics) {
        expect(metric.cardHeight).toBeLessThanOrEqual(280);
        expect(metric.cardHeight).toBeGreaterThanOrEqual(230);
        expect(metric.innerHeight).toBeCloseTo(metric.cardHeight, 0);
        expect(metric.frontHeight).toBeCloseTo(metric.cardHeight, 0);
        expect(metric.backHeight).toBeCloseTo(metric.cardHeight, 0);
        expect(metric.frontFits).toBe(true);
        expect(metric.backFits).toBe(true);
        expect(metric.frontCenterDelta).toBeLessThanOrEqual(2);
      }

      await cards.first().tap();
      await expect(cards.first()).toHaveAttribute("data-flipped", "");
      await expect(cards.first()).toHaveAttribute("aria-pressed", "true");
      await cards.nth(1).evaluate((button: HTMLButtonElement) => button.click());
      await expect(cards.first()).not.toHaveAttribute("data-flipped", "");
      await expect(cards.first()).toHaveAttribute("aria-pressed", "false");
      await expect(cards.nth(1)).toHaveAttribute("data-flipped", "");
      await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "true");

      await context.close();
    }
  });
});

test.describe("home proof carousel", () => {
  test("appears after the process section and supports keyboard controls", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
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

test.describe("home section spacing", () => {
  test("keeps change on the second Process heading line", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await waitForBrandFonts(page);

    const heading = await page.locator(".process-section__header h2").evaluate((node) => {
      const lines = Array.from(node.children).map((child) => {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);
        return {
          text: child.textContent?.trim(),
          height: rect.height,
          lineHeight: Number.parseFloat(style.lineHeight),
        };
      });

      return lines;
    });

    expect(heading.map((line) => line.text)).toEqual([
      "Agile Innovation —",
      "from challenge to change.",
    ]);
    expect(heading.every((line) => line.height <= line.lineHeight + 1)).toBe(true);
  });

  test("keeps process cards equal-height and carousel navigation comfortably spaced", async ({ page }) => {
    await page.setViewportSize({ width: 1836, height: 1050 });
    await page.goto("/");

    const processCardHeights = await page
      .locator(".process-section .innovation-list li")
      .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));

    expect(processCardHeights).toHaveLength(6);
    expect(Math.max(...processCardHeights) - Math.min(...processCardHeights)).toBeLessThan(1);

    await page.setViewportSize({ width: 1210, height: 858 });

    const carouselControlGaps = await page.locator(".proof-carousel__controls").evaluate((controls) => {
      const previous = controls.querySelector<HTMLElement>("[data-proof-prev]");
      const dots = controls.querySelector<HTMLElement>(".proof-carousel__dots");
      const next = controls.querySelector<HTMLElement>("[data-proof-next]");

      if (!previous || !dots || !next) {
        throw new Error("Carousel navigation controls are incomplete");
      }

      const previousRect = previous.getBoundingClientRect();
      const dotsRect = dots.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();

      return {
        left: dotsRect.left - previousRect.right,
        right: nextRect.left - dotsRect.right,
        dotGap: Number.parseFloat(getComputedStyle(dots).gap),
      };
    });

    expect(carouselControlGaps.left).toBeGreaterThanOrEqual(40);
    expect(carouselControlGaps.right).toBeGreaterThanOrEqual(40);
    expect(carouselControlGaps.dotGap).toBeGreaterThanOrEqual(10);
  });
});

test.describe("contact form", () => {
  test("keeps the Contact navigation transparent, underline-free, and direction-aware", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop navigation behavior.");

    await page.goto("/contact/");

    const header = page.locator(".site-header--contact");
    const contactLink = page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Contact" });

    await expect(header).toHaveCSS("background-color", "rgb(17, 26, 16)");
    await contactLink.hover();
    await expect(contactLink).toHaveCSS("color", "rgb(200, 165, 90)");
    expect(await contactLink.evaluate((link) => getComputedStyle(link, "::after").display)).toBe("none");

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 300);
    });
    await expect(header).toHaveAttribute("data-hidden", "");

    await page.evaluate(() => window.scrollTo(0, 250));
    await expect(header).not.toHaveAttribute("data-hidden", "");
  });

  test("contains the approved first-step fields and omits budget and timeline", async ({ page }) => {
    await page.goto("/contact/");

    await expect(page.getByLabel("First Name")).toBeVisible();
    await expect(page.getByLabel("Last Name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Company / Organization")).toBeVisible();
    await expect(page.getByLabel("What problem are you facing?")).toBeVisible();
    await expect(page.getByLabel("What problem are you facing?")).toBeEnabled();

    await expect(page.getByLabel(/budget/i)).toHaveCount(0);
    await expect(page.getByLabel(/timeline/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  });

  test("matches the navbar CTA fill interaction", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop pointer behavior.");

    await page.goto("/contact/");
    const submit = page.getByRole("button", { name: "Continue" });

    await expect(submit).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(submit).toHaveCSS("border-color", "rgb(200, 165, 90)");
    await expect(submit).toHaveCSS("color", "rgb(200, 165, 90)");

    await submit.hover();
    await expect(submit).toHaveCSS("background-color", "rgb(200, 165, 90)");
    await expect(submit).toHaveCSS("border-color", "rgb(200, 165, 90)");
    await expect(submit).toHaveCSS("color", "rgb(253, 250, 245)");
    await expect(submit).toHaveCSS("box-shadow", "none");
    await expect(submit).toHaveCSS("transform", "none");
    expect(await submit.evaluate((button) => getComputedStyle(button, "::after").display)).toBe("none");
  });

  test("matches the approved desktop Contact geometry and type scale", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own desktop viewport matrix.");

    const viewports = [
      {
        width: 1920,
        height: 1257,
        grid: { x: 360, y: 155, width: 1200, height: 717 },
        intro: { x: 360, width: 600 },
        formWrap: { x: 960 },
      },
      {
        width: 1280,
        height: 1200,
        grid: { x: 240, y: 155, width: 800, height: 777 },
        intro: { x: 240, width: 400 },
        formWrap: { x: 640 },
      },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      await page.goto("/contact/");

      const metrics = await page.locator(".contact-panel").evaluate((panel) => {
        const panelRect = panel.getBoundingClientRect();
        const metric = (selector: string) => {
          const node = panel.querySelector<HTMLElement>(selector);
          if (!node) throw new Error(`Missing Contact target: ${selector}`);
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            x: rect.x,
            y: rect.y,
            relativeX: rect.x - panelRect.x,
            relativeY: rect.y - panelRect.y,
            width: rect.width,
            height: rect.height,
            fontSize: Number.parseFloat(style.fontSize),
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
          };
        };

        const problem = panel.querySelector<HTMLTextAreaElement>("#contact-problem");
        if (!problem) throw new Error("Missing Contact problem field");

        return {
          panel: { y: panelRect.y, height: panelRect.height },
          grid: metric(".contact-grid--feature"),
          intro: metric(".contact-intro"),
          label: metric(".contact-intro .eyebrow"),
          title: metric(".contact-intro h1"),
          paragraph: metric(".contact-intro > p:not(.eyebrow)"),
          divider: metric(".contact-divider"),
          details: metric(".contact-details"),
          formWrap: metric(".contact-form-wrap"),
          formTitle: metric(".contact-form-wrap h2"),
          form: metric(".contact-form"),
          button: metric(".contact-form__continue"),
          headingText: panel.querySelector<HTMLElement>(".contact-intro h1")?.innerText,
          paragraphText: panel.querySelector<HTMLElement>(".contact-intro > p:not(.eyebrow)")?.innerText,
          problem: {
            disabled: problem.disabled,
            display: getComputedStyle(problem.closest(".contact-form__field")!).display,
          },
        };
      });

      expect(metrics.panel.y).toBe(115);
      expect(metrics.panel.height).toBe(934);
      const frame = sharedContentFrame(viewport.width);
      expect(metrics.grid.x).toBeCloseTo(frame.x, 0);
      expect(metrics.grid.y).toBeCloseTo(viewport.grid.y, 0);
      expect(metrics.grid.width).toBeCloseTo(frame.width, 0);
      expect(metrics.grid.height).toBe(viewport.grid.height);
      expect(metrics.intro.x).toBeCloseTo(frame.x, 0);
      expect(metrics.intro.width).toBeCloseTo(frame.width / 2, 0);
      expect(metrics.label.relativeY - metrics.grid.relativeY).toBeCloseTo(60, 0);
      expect(metrics.label.fontSize).toBe(18);
      expect(metrics.label.letterSpacing).toBe("5.4px");
      expect(metrics.title.relativeY - metrics.grid.relativeY).toBeCloseTo(115, 0);
      expect(metrics.title.fontSize).toBe(90);
      expect(metrics.title.lineHeight).toBe("77px");
      expect(metrics.paragraph.relativeY - metrics.grid.relativeY).toBeCloseTo(386, 0);
      expect(metrics.paragraph.fontSize).toBe(20);
      expect(metrics.paragraph.lineHeight).toBe("25.76px");
      expect(metrics.divider.relativeY - metrics.grid.relativeY).toBeCloseTo(520.75, 0);
      expect(metrics.details.relativeY - metrics.grid.relativeY).toBeCloseTo(548.75, 0);
      expect(metrics.formWrap.x).toBeCloseTo(frame.x + frame.width / 2, 0);
      expect(metrics.formTitle.relativeY - metrics.grid.relativeY).toBeCloseTo(90, 0);
      expect(metrics.formTitle.fontSize).toBe(40);
      expect(metrics.form.relativeY - metrics.grid.relativeY).toBeCloseTo(196, 0);
      expect(metrics.form.width).toBeLessThanOrEqual(frame.width / 2);
      expect(metrics.form.height).toBe(392);
      expect(metrics.button.width).toBe(169);
      expect(metrics.button.height).toBe(42);
      expect(metrics.headingText).toBe("Let's build\nsomething\ntogether.");
      expect(metrics.paragraphText).toBe(
        "Whether you're tackling a strategic challenge or launching something new — we want to hear about it.\nTell us what you're working on.",
      );
      expect(metrics.problem).toEqual({ disabled: false, display: "block" });

      await context.close();
    }
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

  test("reduced motion disables the animated hero mountain renderer", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL: "http://127.0.0.1:4321",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    await page.goto("/");

    const hero = page.locator(".home-hero");
    const expectedMotionState = (page.viewportSize()?.width ?? 0) < 768 ? "disabled" : "reduced";

    await expect(hero).toHaveAttribute("data-mountain-motion", expectedMotionState);
    await expect(hero.locator("canvas[data-mountain-webgl]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    await context.close();
  });
});
