document.addEventListener("DOMContentLoaded", () => {
  const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll"));

  if (revealItems.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
    return;
  }

  revealItems.forEach((item, index) => {
    if (item.matches(".category-item")) {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
      return;
    }

    if (item.matches(".gallery-item")) {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
      return;
    }

    if (item.matches(".footer-brand, .footer-contact, .footer-social")) {
      const footerIndex = ["footer-brand", "footer-contact", "footer-social"].findIndex((className) => item.classList.contains(className));
      item.style.setProperty("--reveal-delay", `${Math.max(footerIndex, 0) * 90}ms`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => {
    observer.observe(item);
  });
});
