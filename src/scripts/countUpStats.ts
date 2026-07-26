const COUNT_UP_SELECTOR = "[data-count-up]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COUNT_UP_DURATION = 1600;
const COUNT_UP_STAGGER = 45;
const COUNT_UP_READY_ATTRIBUTE = "data-count-up-ready";

const getCountParts = (element: HTMLElement) => {
  const target = Number.parseInt(element.dataset.countTarget ?? "", 10);
  const suffix = element.dataset.countSuffix ?? "";

  if (!Number.isFinite(target)) {
    return null;
  }

  return { suffix, target };
};

const setCountText = (element: HTMLElement, value: number, suffix: string) => {
  element.textContent = `${value}${suffix}`;
};

const animateCount = (element: HTMLElement, delay: number) => {
  const countParts = getCountParts(element);

  if (!countParts) {
    return;
  }

  const { suffix, target } = countParts;
  let startTime: number | undefined;
  let hasStarted = false;

  const tick = (timestamp: number) => {
    if (startTime === undefined) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;

    if (elapsed < delay) {
      window.requestAnimationFrame(tick);
      return;
    }

    if (!hasStarted) {
      hasStarted = true;
      element.removeAttribute(COUNT_UP_READY_ATTRIBUTE);
    }

    const progress = Math.min((elapsed - delay) / COUNT_UP_DURATION, 1);
    const nextValue = progress > 0 && target > 0
      ? Math.max(1, Math.round(target * progress))
      : 0;

    setCountText(element, nextValue, suffix);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    setCountText(element, target, suffix);
  };

  window.requestAnimationFrame(tick);
};

export const initCountUpStats = () => {
  const stats = Array.from(document.querySelectorAll<HTMLElement>(COUNT_UP_SELECTOR));

  if (stats.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    stats.forEach((stat) => {
      const countParts = getCountParts(stat);
      if (countParts) setCountText(stat, countParts.target, countParts.suffix);
      stat.removeAttribute(COUNT_UP_READY_ATTRIBUTE);
    });
    return;
  }

  const statGrid = stats[0]?.closest(".stat-grid");

  if (!statGrid) {
    return;
  }

  stats.forEach((stat) => {
    stat.setAttribute(COUNT_UP_READY_ATTRIBUTE, "");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        stats.forEach((stat, index) => animateCount(stat, index * COUNT_UP_STAGGER));
        observer.disconnect();
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.2,
    },
  );

  observer.observe(statGrid);
};
