document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-hero-carousel]");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  const prevButton = carousel.querySelector("[data-hero-prev]");
  const nextButton = carousel.querySelector("[data-hero-next]");
  const AUTOPLAY_DELAY = 4500;
  let currentIndex = 0;
  let autoplayId = null;

  function renderSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    renderSlides();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function previousSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    // Advances the hero automatically so the brand images keep moving without user action.
    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
    }
  }

  prevButton?.addEventListener("click", () => {
    previousSlide();
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    nextSlide();
    startAutoplay();
  });

  renderSlides();
  startAutoplay();
});
