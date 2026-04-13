document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-image]"));
  const lightbox = document.querySelector("[data-gallery-lightbox]");
  const lightboxImage = document.querySelector("[data-gallery-lightbox-image]");
  const closeButtons = Array.from(document.querySelectorAll("[data-gallery-close]"));

  if (galleryItems.length === 0 || !lightbox || !lightboxImage) {
    return;
  }

  function openLightbox(imageSrc, imageAlt) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightbox.hidden = false;
    document.body.classList.add("gallery-lightbox-open");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("gallery-lightbox-open");
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");

      if (!image) {
        return;
      }

      openLightbox(item.dataset.galleryImage || image.src, image.alt);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
});
