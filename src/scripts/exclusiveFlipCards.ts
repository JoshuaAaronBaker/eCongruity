const setFlipped = (card: HTMLButtonElement, flipped: boolean) => {
  card.toggleAttribute("data-flipped", flipped);
  card.setAttribute("aria-pressed", String(flipped));
};

export const initExclusiveFlipCards = (selector: string) => {
  const cards = Array.from(document.querySelectorAll<HTMLButtonElement>(selector));

  const closeOtherCards = (activeCard: HTMLButtonElement) => {
    cards.forEach((card) => {
      if (card !== activeCard) setFlipped(card, false);
    });
  };

  cards.forEach((card) => {
    setFlipped(card, false);

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      closeOtherCards(card);
      setFlipped(card, true);
    });

    card.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch") setFlipped(card, false);
    });

    card.addEventListener("focus", () => {
      if (!card.matches(":focus-visible")) return;
      closeOtherCards(card);
      setFlipped(card, true);
    });

    card.addEventListener("blur", () => setFlipped(card, false));

    card.addEventListener("click", () => {
      const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (hasFinePointer || card.matches(":focus-visible")) {
        closeOtherCards(card);
        setFlipped(card, true);
        return;
      }

      const shouldFlip = !card.hasAttribute("data-flipped");
      closeOtherCards(card);
      setFlipped(card, shouldFlip);
    });
  });
};
