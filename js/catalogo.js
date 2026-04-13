document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector("[data-product-grid]");
  const feedback = document.querySelector("[data-cart-feedback]");

  if (!productGrid || typeof PRODUCTS === "undefined") {
    return;
  }

  // Builds the catalog cards from the shared product data.
  productGrid.innerHTML = PRODUCTS.map((product) => {
    const previewImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "";

    return `
      <article class="product-card">
        <a class="product-image-link" href="producto.html?id=${product.id}" aria-label="Ver detalle de ${product.name}">
          <img class="product-image" src="${previewImage}" alt="${product.name}" loading="lazy" />
        </a>
        <div class="product-card-body">
          <p class="product-price">$${product.price.toLocaleString("es-UY")}</p>
          <h2>${product.name}</h2>
          <p class="product-description">${product.description}</p>
        </div>
        <div class="product-actions">
          <a class="button button-secondary" href="producto.html?id=${product.id}">Ver detalle</a>
          <button class="button button-primary" type="button" data-add-to-cart="${product.id}">Agregar al carrito</button>
        </div>
      </article>
    `;
  }).join("");

  // Uses event delegation so one listener can manage all product buttons.
  productGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");

    if (!addButton) {
      return;
    }

    const productId = Number(addButton.dataset.addToCart);
    const product = PRODUCTS.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    HuellasCart.addProduct(productId);

    if (feedback) {
      feedback.textContent = `${product.name} fue agregado al carrito.`;
    }

    window.dispatchEvent(new CustomEvent("huellas:open-cart"));
  });
});
