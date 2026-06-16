const REVEAL_SCOPE_SELECTOR = ".section-band > .site-container, .contact-panel > .site-container";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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
    Array.from(scope.children).filter((child): child is HTMLElement => child instanceof HTMLElement),
  );

  if (targets.length === 0) {
    return;
  }

  const reveal = (element: HTMLElement) => {
    element.setAttribute("data-scroll-reveal-visible", "");
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
    target.style.setProperty("--scroll-reveal-delay", `${Math.min(index % 3, 2) * 70}ms`);

    if (isInitiallyVisible(target)) {
      reveal(target);
      return;
    }

    observer.observe(target);
  });

  document.body.setAttribute("data-scroll-reveal-ready", "");
};
