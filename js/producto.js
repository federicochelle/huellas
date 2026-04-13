document.addEventListener("DOMContentLoaded", () => {
  const productRoot = document.querySelector("[data-product-detail]");
  if (!productRoot || typeof PRODUCTS === "undefined") {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const productId = Number(searchParams.get("id"));
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    productRoot.innerHTML = `
      <article class="product-not-found">
        <h2>Producto no encontrado</h2>
        <p>La pieza que buscás no está disponible o el enlace no es válido.</p>
        <a class="button button-primary" href="catalogo.html">Volver al catálogo</a>
      </article>
    `;
    return;
  }

  document.title = `Huellas | ${product.name}`;
  const productImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const visibleThumbnails = productImages.slice(0, 3);

  productRoot.innerHTML = `
    <article class="product-detail-card">
      <div class="product-detail-media">
        <button class="product-detail-main-image" type="button" data-open-lightbox aria-label="Ver imagen ampliada de ${product.name}">
          <img class="product-detail-image" src="${productImages[0]}" alt="${product.name}" data-main-product-image />
        </button>
        <div class="product-detail-thumbnails" aria-label="Galeria de imagenes de ${product.name}">
          ${visibleThumbnails.map((image, index) => `
            <button
              class="product-thumbnail${index === 0 ? " is-active" : ""}"
              type="button"
              data-thumbnail-index="${index}"
              data-thumbnail-image="${image}"
              aria-label="Ver imagen ${index + 1} de ${product.name}"
            >
              <img src="${image}" alt="" loading="lazy" />
            </button>
          `).join("")}
        </div>
      </div>
      <div class="product-detail-content">
        <span class="eyebrow">Pieza artesanal</span>
        <p class="product-price">$${product.price.toLocaleString("es-UY")}</p>
        <h2>${product.name}</h2>
        <p class="product-description">${product.description}</p>

        <div class="product-meta">
          <article class="product-meta-card">
            <h3>Dimensiones</h3>
            <p>${product.dimensions}</p>
          </article>
          <article class="product-meta-card">
            <h3>Material</h3>
            <p>${product.material}</p>
          </article>
        </div>

        <div class="product-detail-actions">
          <button class="button button-primary" type="button" data-product-add>
            Agregar al carrito
          </button>
          <a class="button button-secondary" href="${buildWhatsAppUrl(product)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp sobre ${product.name}">
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
    <div class="product-lightbox" data-product-lightbox hidden>
      <button class="product-lightbox-overlay" type="button" data-close-lightbox aria-label="Cerrar vista ampliada"></button>
      <div class="product-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Imagen ampliada de ${product.name}">
        <button class="product-lightbox-close" type="button" data-close-lightbox aria-label="Cerrar imagen ampliada">×</button>
        <img class="product-lightbox-image" src="${productImages[0]}" alt="${product.name}" data-lightbox-image />
      </div>
    </div>
  `;

  const addButton = productRoot.querySelector("[data-product-add]");
  const mainImage = productRoot.querySelector("[data-main-product-image]");
  const thumbnails = Array.from(productRoot.querySelectorAll("[data-thumbnail-index]"));
  const lightbox = productRoot.querySelector("[data-product-lightbox]");
  const lightboxImage = productRoot.querySelector("[data-lightbox-image]");
  const lightboxTriggers = Array.from(productRoot.querySelectorAll("[data-open-lightbox], [data-close-lightbox]"));
  const feedback = document.querySelector("[data-product-feedback]");
  let activeImage = productImages[0];

  if (!addButton) {
    return;
  }

  function updateActiveImage(image, index) {
    activeImage = image;
    if (mainImage) {
      mainImage.src = image;
    }

    if (lightboxImage) {
      lightboxImage.src = image;
    }

    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      thumbnail.classList.toggle("is-active", thumbnailIndex === index);
    });
  }

  function openLightbox() {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightbox.hidden = false;
    lightboxImage.src = activeImage;
    document.body.classList.add("product-lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightbox.hidden = true;
    document.body.classList.remove("product-lightbox-open");
  }

  // Adds the current product to the shared cart and opens the drawer immediately.
  addButton.addEventListener("click", () => {
    HuellasCart.addProduct(product.id);

    if (feedback) {
      feedback.textContent = `${product.name} fue agregado al carrito.`;
    }

    window.dispatchEvent(new CustomEvent("huellas:open-cart"));
  });

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const index = Number(thumbnail.dataset.thumbnailIndex);
      const image = thumbnail.dataset.thumbnailImage;

      updateActiveImage(image, index);
    });
  });

  productRoot.querySelector("[data-open-lightbox]")?.addEventListener("click", openLightbox);

  lightboxTriggers.forEach((trigger) => {
    if (trigger.hasAttribute("data-close-lightbox")) {
      trigger.addEventListener("click", closeLightbox);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  function buildWhatsAppUrl(currentProduct) {
    const message = [
      `Hola, quiero consultar por esta pieza de Huellas:`,
      "",
      `${currentProduct.name}`,
      `Precio: $${currentProduct.price.toLocaleString("es-UY")}`,
      `Dimensiones: ${currentProduct.dimensions}`,
      `Material: ${currentProduct.material}`
    ].join("\n");

    return `https://wa.me/${HUELLAS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
});
