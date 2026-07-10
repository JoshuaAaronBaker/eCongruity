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
    heading: "Where Nature Meets Innovation",
  },
  ...navItems,
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

test.describe("mobile horizontal gutters", () => {
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
      const expectedContentWidth = Math.min(310, width - 80);
      const expectedGutter = (width - expectedContentWidth) / 2;

      for (const pageConfig of pagesToCheck) {
        const context = await browser.newContext({
          deviceScaleFactor: 1,
          reducedMotion: "reduce",
          viewport: { width, height: 900 },
        });
        const page = await context.newPage();
        await page.goto(pageConfig.path);

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

test.describe("homepage mobile Figma typography", () => {
  test("preserves the exact 390px line composition and type metrics", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs in its own Figma-sized viewport.");

    const context = await browser.newContext({
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("/");

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
        ".what-section__body .copy-lines--mobile",
        "eCongruity bridges the gap between big\nideas and real-world execution. We blend\nstrategic thinking with the right technologies\nto help organizations move faster, work\nsmarter, and grow with intention.",
      ],
      [
        ".expertise-sub .copy-lines--mobile",
        "We bring together best-in-class\ntechnologies and methodologies to take your\nsolutions from concept to marketplace.",
      ],
      [
        ".process-section__intro .copy-lines--mobile",
        "You have big ideas. We have a proven\nprocess to get you there quickly,\ncollaboratively, and with built-in learning at\nevery step.",
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
        [".what-section__body", "15px", "23.25px"],
        [".expertise-section h2", "40px", "46px"],
        [".process-section h2", "40px", "46px"],
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
      expect(metric.width, `${metric.selector} uses the 310px Figma column`).toBeCloseTo(310, 0);
    }

    await context.close();
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
    await expect(page.getByRole("heading", { level: 1, name: "Where Nature Meets Innovation" })).toBeVisible();

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

            return {
              heroTop: Math.round(heroRect.y * 100) / 100,
              label: metric(selectors.label),
              title: metric(selectors.title),
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
        content: { x: 408, y: 174.5 },
        logo: { x: 89, y: 28, width: 212, height: 50 },
        fontSize: 120,
      },
      {
        name: "small-desktop",
        width: 1280,
        height: 748,
        hero: { x: 0, y: 115, width: 1280, height: 585 },
        content: { x: 152, y: 155 },
        logo: { x: 89, y: 28, width: 212, height: 50 },
        fontSize: 80,
      },
      {
        name: "tablet",
        width: 744,
        height: 603,
        hero: { x: 0, y: 56, width: 744, height: 515.58 },
        content: { x: 64, y: 108 },
        logo: { x: 32, y: 11.52, width: 140, height: 32.95 },
        fontSize: 46.4,
      },
      {
        name: "mobile",
        width: 390,
        height: 476,
        hero: { x: 0, y: 56, width: 390, height: 409 },
        content: { x: 40, y: 120 },
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

      const hero = page.locator(".about-hero");
      const content = hero.locator(".page-hero__inner");
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
      expect(metrics.heroBackground).toBe("rgb(15, 27, 16)");
      expect(metrics.accentColor).toBe("rgb(123, 160, 138)");

      await page.screenshot({
        path: `output/screenshots/about-nav-hero-${viewport.name}-final.png`,
      });

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

    await expect(header).toHaveCSS("background-color", "rgba(15, 27, 16, 0)");
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
        inner: { x: 410, y: 126, width: 1100 },
        fontSize: 64,
      },
      {
        name: "small-desktop",
        width: 1280,
        height: 748,
        section: { y: 710, height: 850 },
        inner: { x: 92, y: 126, width: 1134 },
        fontSize: 64,
      },
      {
        name: "tablet",
        width: 744,
        height: 603,
        section: { y: 571.58, height: 927.97 },
        inner: { x: 64, y: 100, width: 619.43 },
        fontSize: 64,
      },
      {
        name: "mobile",
        width: 390,
        height: 476,
        section: { y: 465, height: 955.75 },
        inner: { x: 40, y: 64, width: 310 },
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
          inner: {
            x: innerRect.x - sectionRect.x,
            y: innerRect.y - sectionRect.y,
            width: innerRect.width,
          },
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
        };
      });

      expect(metrics.section.y).toBeCloseTo(viewport.section.y, 0);
      expect(metrics.section.height).toBeCloseTo(viewport.section.height, 0);
      expect(metrics.inner.x).toBeCloseTo(viewport.inner.x, 0);
      expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      expect(metrics.inner.width).toBeCloseTo(viewport.inner.width, 0);
      expect(metrics.fontSize).toBe(viewport.fontSize);

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
        inner: { x: 94, y: 140, width: 1112 },
        copy: { x: 94, y: 370.3 },
        timeline: { x: 700, y: 140 },
        fontSize: 64,
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
          inner: relativeRect(innerNode),
          copy: relativeRect(copyNode),
          timeline: relativeRect(timelineNode),
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
        };
      });

      expect(metrics.section.y).toBeCloseTo(viewport.section.y, 0);
      expect(metrics.section.height).toBeCloseTo(viewport.section.height, 0);
      expect(metrics.inner.x).toBeCloseTo(viewport.inner.x, 0);
      expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      expect(metrics.inner.width).toBeCloseTo(viewport.inner.width, 0);
      expect(metrics.copy.x).toBeCloseTo(viewport.copy.x, 0);
      expect(metrics.copy.y).toBeCloseTo(viewport.copy.y, 0);
      expect(metrics.timeline.x).toBeCloseTo(viewport.timeline.x, 0);
      expect(metrics.timeline.y).toBeCloseTo(viewport.timeline.y, 0);
      expect(metrics.fontSize).toBe(viewport.fontSize);

      await section.screenshot({
        path: `output/screenshots/about-story-${viewport.name}-final.png`,
      });

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
        inner: { x: 82, y: 141, width: 1100 },
        grid: { x: 82, y: 396.19, width: 1100 },
        card: { width: 350.67, height: 500 },
        image: { width: 348.67, height: 348.66 },
        fontSize: 64,
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
          inner: relativeRect(innerNode),
          grid: relativeRect(gridNode),
          card: relativeRect(cardNode),
          image: relativeRect(imageNode),
          cards,
          columnCount: getComputedStyle(gridNode).gridTemplateColumns.split(" ").length,
          fontSize: Number.parseFloat(getComputedStyle(headingNode).fontSize),
        };
      });

      expect(metrics.section.y).toBeCloseTo(viewport.section.y, 0);
      expect(metrics.section.height).toBeCloseTo(viewport.section.height, 0);
      expect(metrics.inner.x).toBeCloseTo(viewport.inner.x, 0);
      expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      expect(metrics.inner.width).toBeCloseTo(viewport.inner.width, 0);
      expect(metrics.grid.x).toBeCloseTo(viewport.grid.x, 0);
      expect(metrics.grid.y).toBeCloseTo(viewport.grid.y, 0);
      expect(metrics.grid.width).toBeCloseTo(viewport.grid.width, 0);
      expect(metrics.card.width).toBeCloseTo(viewport.card.width, 0);
      expect(metrics.card.height).toBeCloseTo(viewport.card.height, 0);
      expect(metrics.image.width).toBeCloseTo(viewport.image.width, 0);
      expect(metrics.image.height).toBeCloseTo(viewport.image.height, 0);
      expect(metrics.fontSize).toBe(viewport.fontSize);

      for (const card of metrics.cards) {
        expect(card.width).toBeCloseTo(metrics.cards[0].width, 2);
        expect(card.height).toBeCloseTo(metrics.cards[0].height, 2);
        expect(card.image.y).toBeCloseTo(metrics.cards[0].image.y, 2);
        expect(card.image.width).toBeCloseTo(metrics.cards[0].image.width, 2);
        expect(card.image.height).toBeCloseTo(metrics.cards[0].image.height, 2);
        expect(card.caption.y).toBeCloseTo(metrics.cards[0].caption.y, 2);
        expect(card.caption.width).toBeCloseTo(metrics.cards[0].caption.width, 2);
        expect(card.caption.height).toBeCloseTo(metrics.cards[0].caption.height, 2);
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
    await cards.first().tap();
    await expect(cards.first()).not.toHaveAttribute("data-flipped", "");
    await expect(cards.first()).toHaveAttribute("aria-pressed", "false");

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
        container: { x: 88, y: 140, width: 1100 },
        label: { y: 140, size: 18, line: 23, tracking: 5.4 },
        heading: { y: 183, size: 64, line: 73.6 },
        lead: { y: 276.6, width: 520, size: 20, line: 28 },
        grid: { y: 424.6, width: 1100, height: 676.38, columns: 3, gap: 16 },
        cards: { width: 356, heights: [329.7, 329.7, 329.7, 329.7, 329.7, 329.7] },
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
          sectionHeight: sectionRect.height,
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

      expect(metrics.sectionHeight).toBeCloseTo(viewport.sectionHeight, 0);
      expect(metrics.container.x).toBeCloseTo(viewport.container.x, 0);
      expect(metrics.container.y).toBeCloseTo(viewport.container.y, 0);
      expect(metrics.container.width).toBeCloseTo(viewport.container.width, 0);
      expect(metrics.label.y).toBeCloseTo(viewport.label.y, 0);
      expect(metrics.label.fontSize).toBe(viewport.label.size);
      expect(metrics.label.lineHeight).toBeCloseTo(viewport.label.line, 0);
      expect(metrics.label.tracking).toBe(viewport.label.tracking);
      expect(metrics.heading.y).toBeCloseTo(viewport.heading.y, 0);
      expect(metrics.heading.fontSize).toBe(viewport.heading.size);
      expect(metrics.heading.lineHeight).toBe(viewport.heading.line);
      expect(metrics.lead.y).toBeCloseTo(viewport.lead.y, 0);
      expect(metrics.lead.width).toBeCloseTo(viewport.lead.width, 0);
      expect(metrics.lead.fontSize).toBe(viewport.lead.size);
      expect(metrics.lead.lineHeight).toBe(viewport.lead.line);
      expect(metrics.grid.y).toBeCloseTo(viewport.grid.y, 0);
      expect(metrics.grid.width).toBeCloseTo(viewport.grid.width, 0);
      expect(metrics.grid.height).toBeCloseTo(viewport.grid.height, 0);
      expect(metrics.grid.columns).toBe(viewport.grid.columns);
      expect(metrics.grid.gap).toBe(viewport.grid.gap);
      expect(metrics.cardType).toEqual(viewport.cardType);

      for (const [index, card] of metrics.cards.entries()) {
        expect(card.width).toBeCloseTo(viewport.cards.width, 0);
        expect(card.height).toBeCloseTo(viewport.cards.heights[index], 0);
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
        footerHeight: 129,
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
        footerHeight: 193,
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
        footerHeight: 193,
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
        const footer = document.querySelector<HTMLElement>(".site-footer--about");
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
      expect(metrics.inner.x).toBeCloseTo(viewport.inner.x, 0);
      expect(metrics.inner.y).toBeCloseTo(viewport.inner.y, 0);
      expect(metrics.inner.width).toBeCloseTo(viewport.inner.width, 0);
      expect(metrics.heading.y).toBeCloseTo(viewport.heading.y, 0);
      expect(metrics.heading.fontSize).toBe(viewport.heading.size);
      expect(metrics.heading.lineHeight).toBe(viewport.heading.line);
      expect(metrics.body.x).toBeCloseTo(viewport.body.x, 0);
      expect(metrics.body.y).toBeCloseTo(viewport.body.y, 0);
      expect(metrics.body.width).toBeCloseTo(viewport.body.width, 0);
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
      expect(metrics.footerHeight).toBeCloseTo(viewport.footerHeight, 0);
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

test.describe("home section spacing", () => {
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

    await expect(header).toHaveCSS("background-color", "rgba(15, 27, 16, 0)");
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

  test("matches the approved desktop Contact geometry and type scale", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Runs its own desktop viewport matrix.");

    const viewports = [
      {
        width: 1920,
        height: 1257,
        grid: { x: 360, y: 223.5, width: 1200, height: 717 },
        intro: { x: 360, width: 600 },
        formWrap: { x: 960 },
      },
      {
        width: 1280,
        height: 1200,
        grid: { x: 40, y: 188.5, width: 1200, height: 777 },
        intro: { x: 145, width: 495 },
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
      expect(metrics.grid.x).toBeCloseTo(viewport.grid.x, 0);
      expect(metrics.grid.y).toBeCloseTo(viewport.grid.y, 0);
      expect(metrics.grid.width).toBe(viewport.grid.width);
      expect(metrics.grid.height).toBe(viewport.grid.height);
      expect(metrics.intro.x).toBeCloseTo(viewport.intro.x, 0);
      expect(metrics.intro.width).toBe(viewport.intro.width);
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
      expect(metrics.formWrap.x).toBeCloseTo(viewport.formWrap.x, 0);
      expect(metrics.formTitle.relativeY - metrics.grid.relativeY).toBeCloseTo(153.78, 0);
      expect(metrics.formTitle.fontSize).toBe(40);
      expect(metrics.form.relativeY - metrics.grid.relativeY).toBeCloseTo(261.78, 0);
      expect(metrics.form.width).toBe(540);
      expect(metrics.form.height).toBe(303);
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
