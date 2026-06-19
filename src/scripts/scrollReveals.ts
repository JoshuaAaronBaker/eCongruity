const REVEAL_SCOPE_SELECTOR = ".section-band > .site-container, .contact-panel > .site-container";
const ITEM_REVEAL_SELECTOR = ".story-timeline";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCROLL_REVEAL_WAIT = 130;

const getRevealDirection = (element: HTMLElement, index: number) => {
  const rect = element.getBoundingClientRect();
  const center = rect.left + rect.width / 2;
  const viewportCenter = window.innerWidth / 2;

  if (rect.width > window.innerWidth * 0.72) {
    return index % 2 === 0 ? "left" : "right";
  }

  return center < viewportCenter ? "left" : "right";
};

const isInitiallyVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();

  return rect.top < window.innerHeight * 0.92;
};

export const initScrollReveals = () => {
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const scopes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SCOPE_SELECTOR));
  const targets = scopes.flatMap((scope) =>
    Array.from(scope.children).flatMap((child) => {
      if (!(child instanceof HTMLElement)) {
        return [];
      }

      if (child.matches(ITEM_REVEAL_SELECTOR)) {
        return Array.from(child.children).filter((item): item is HTMLElement => item instanceof HTMLElement);
      }

      return [child];
    }),
  );

  if (targets.length === 0) {
    return;
  }

  const revealTimers = new WeakSet<HTMLElement>();

  const reveal = (element: HTMLElement, wait = SCROLL_REVEAL_WAIT) => {
    if (revealTimers.has(element) || element.hasAttribute("data-scroll-reveal-visible")) {
      return;
    }

    revealTimers.add(element);
    window.setTimeout(() => {
      element.setAttribute("data-scroll-reveal-visible", "");
    }, wait);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -14% 0px",
      threshold: 0.16,
    },
  );

  targets.forEach((target, index) => {
    target.dataset.scrollReveal = getRevealDirection(target, index);
    const siblingIndex = target.parentElement
      ? Array.from(target.parentElement.children).indexOf(target)
      : index;
    const staggerIndex = target.parentElement?.matches(ITEM_REVEAL_SELECTOR) ? siblingIndex : index % 3;

    target.style.setProperty("--scroll-reveal-delay", `${Math.min(staggerIndex, 5) * 80}ms`);

    if (isInitiallyVisible(target)) {
      reveal(target, 0);
      return;
    }

    observer.observe(target);
  });

  document.body.setAttribute("data-scroll-reveal-ready", "");
};
