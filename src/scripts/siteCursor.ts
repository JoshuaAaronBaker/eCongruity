const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const RING_EASE = 0.085;

export const initSiteCursor = () => {
  const cursor = document.querySelector<HTMLElement>("[data-site-cursor]");
  const canUseCustomCursor =
    window.matchMedia(POINTER_QUERY).matches && !window.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (!cursor || !canUseCustomCursor) {
    cursor?.setAttribute("hidden", "");
    return;
  }

  const ring = cursor.querySelector<HTMLElement>(".site-cursor__ring");
  const dot = cursor.querySelector<HTMLElement>(".site-cursor__dot");

  if (!ring || !dot) {
    return;
  }

  document.documentElement.setAttribute("data-custom-cursor", "");

  let animationFrame = 0;
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let isVisible = false;

  const setVisible = (visible: boolean) => {
    isVisible = visible;
    cursor.toggleAttribute("data-visible", visible);
  };

  const render = () => {
    currentX += (targetX - currentX) * RING_EASE;
    currentY += (targetY - currentY) * RING_EASE;

    ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    animationFrame = window.requestAnimationFrame(render);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") {
      setVisible(false);
      return;
    }

    targetX = event.clientX;
    targetY = event.clientY;

    if (!isVisible) {
      currentX = targetX;
      currentY = targetY;
      setVisible(true);
    }
  };

  const handlePointerDown = () => cursor.setAttribute("data-pressed", "");
  const handlePointerUp = () => cursor.removeAttribute("data-pressed");

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("pointerup", handlePointerUp, { passive: true });
  document.addEventListener("mouseleave", () => setVisible(false));
  animationFrame = window.requestAnimationFrame(render);

  window.addEventListener(
    "pagehide",
    () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeAttribute("data-custom-cursor");
    },
    { once: true },
  );
};
