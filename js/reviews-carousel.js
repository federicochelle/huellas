document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-reviews-carousel]");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll(".review-card"));
  const dots = Array.from(carousel.querySelectorAll(".reviews-dot"));
  const prevButton = carousel.querySelector("[data-reviews-prev]");
  const nextButton = carousel.querySelector("[data-reviews-next]");
  const AUTOPLAY_DELAY = 5500;
  let currentIndex = 0;
  let autoplayId = null;

  function renderSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
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
    // Keeps the testimonials rotating automatically with a calm, continuous rhythm.
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

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoplay();
    });
  });

  renderSlides();
  startAutoplay();
});
