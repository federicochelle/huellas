document.addEventListener("DOMContentLoaded", () => {
  if (typeof PRODUCTS === "undefined" || typeof HuellasCart === "undefined") {
    return;
  }

  const BANK_TRANSFER = {
    bank: "BROU",
    holder: "Nombre Apellido",
    account: "123456789",
    alias: "HUELLAS.ARTE"
  };

  const body = document.body;
  const cartLinks = document.querySelectorAll('a[href="carrito.html"]');
  let lastFocusedElement = null;

  createCartDrawer();
  createTransferModal();

  const drawer = document.querySelector("[data-cart-drawer]");
  const overlay = document.querySelector("[data-cart-overlay]");
  const drawerItems = document.querySelector("[data-drawer-items]");
  const drawerSummary = document.querySelector("[data-drawer-summary]");
  const closeButton = document.querySelector("[data-close-cart]");
  const transferModal = document.querySelector("[data-transfer-modal]");
  const transferOverlay = document.querySelector("[data-transfer-overlay]");
  const transferCloseButtons = document.querySelectorAll("[data-close-transfer]");
  const transferAccountValue = document.querySelector("[data-transfer-account]");
  const transferCopyButton = document.querySelector("[data-copy-transfer]");
  const transferCopyFeedback = document.querySelector("[data-copy-feedback]");

  function getProductImage(product) {
    return product.images?.[0] || product.image || "";
  }
 
  function getCartProducts() {
    // Merges cart storage with product data so the drawer can render full item details.
    return HuellasCart.getCart()
      .map((item) => {
        const product = PRODUCTS.find((entry) => entry.id === item.id);

        if (!product) {
          return null;
        }

        return {
          ...product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity
        };
      })
      .filter(Boolean);
  }

  function buildWhatsAppMessage(cartProducts, total) {
    // Generates a readable order summary to send directly to WhatsApp.
    const lines = [
      "Hola, quiero finalizar este pedido de Huellas:",
      "",
      ...cartProducts.map((product) => `- ${product.name} x${product.quantity} - $${product.subtotal.toLocaleString("es-UY")}`),
      "",
      `Total: $${total.toLocaleString("es-UY")}`
    ];

    return lines.join("\n");
  }

 function updateCountBadges() {
  const count = HuellasCart.getItemCount();
  const countBadges = document.querySelectorAll("[data-cart-count]");

  countBadges.forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

  function openDrawer() {
    lastFocusedElement = document.activeElement;
    drawer.classList.add("is-open");
    overlay.classList.add("is-visible");
    drawer.setAttribute("aria-hidden", "false");
    body.classList.add("cart-drawer-open");
    closeButton.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    drawer.setAttribute("aria-hidden", "true");
    body.classList.remove("cart-drawer-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function openWhatsAppCheckout() {
    const cartProducts = getCartProducts();

    if (cartProducts.length === 0) {
      return;
    }

    const total = cartProducts.reduce((sum, product) => sum + product.subtotal, 0);
    const message = buildWhatsAppMessage(cartProducts, total);
    const whatsappUrl = `https://wa.me/${HUELLAS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }

  function openTransferModal() {
    if (!transferModal) {
      return;
    }

    transferModal.hidden = false;
    body.classList.add("transfer-modal-open");
    transferCloseButtons[0]?.focus();
  }

  function closeTransferModal() {
    if (!transferModal) {
      return;
    }

    transferModal.hidden = true;
    body.classList.remove("transfer-modal-open");

    if (transferCopyFeedback) {
      transferCopyFeedback.textContent = "";
    }
  }

  async function copyTransferAccount() {
    if (!transferAccountValue || !transferCopyFeedback) {
      return;
    }

    try {
      await navigator.clipboard.writeText(transferAccountValue.textContent.trim());
      transferCopyFeedback.textContent = "Copiado ✔";
    } catch (error) {
      transferCopyFeedback.textContent = "No se pudo copiar";
    }
  }

  function renderDrawer() {
    const cartProducts = getCartProducts();
    const total = cartProducts.reduce((sum, product) => sum + product.subtotal, 0);

    updateCountBadges();

    if (cartProducts.length === 0) {
      drawerItems.innerHTML = `
        <article class="cart-drawer-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá una pieza desde el catálogo para verla acá al instante.</p>
          <a class="button button-primary" href="catalogo.html">Ver catálogo</a>
        </article>
      `;

      drawerSummary.innerHTML = `
        <div class="cart-drawer-summary-card">
          <div class="summary-row">
            <span>Total</span>
            <strong>$0</strong>
          </div>
          
        </div>
      `;
      return;
    }

   drawerItems.innerHTML = cartProducts
  .map((product) => {
    return `
      <article class="cart-drawer-item">
        <img class="cart-drawer-image" src="${getProductImage(product)}" alt="${product.name}" />
        <div class="cart-drawer-info">
          <p class="product-price">$${product.price.toLocaleString("es-UY")}</p>
          <h2>${product.name}</h2>
          <p class="cart-drawer-subtotal">Subtotal: $${product.subtotal.toLocaleString("es-UY")}</p>
          <div class="cart-drawer-actions">
            <div class="quantity-control" aria-label="Cantidad de ${product.name}">
              <button type="button" aria-label="Disminuir cantidad de ${product.name}" data-cart-action="decrease" data-product-id="${product.id}">-</button>
              <span>${product.quantity}</span>
              <button type="button" aria-label="Aumentar cantidad de ${product.name}" data-cart-action="increase" data-product-id="${product.id}">+</button>
            </div>
            <button class="text-button" type="button" data-cart-action="remove" data-product-id="${product.id}">
              Quitar
            </button>
          </div>
        </div>
      </article>
    `;
  })
  .join("");

    drawerSummary.innerHTML = `
      <div class="cart-drawer-summary-card">
        <div class="summary-row">
          <span>Productos</span>
          <strong>${HuellasCart.getItemCount()}</strong>
        </div>
        <div class="summary-row">
          <span>Total</span>
          <strong>$${total.toLocaleString("es-UY")}</strong>
        </div>
        <button class="button button-primary summary-button" type="button" data-transfer-checkout>
          Pagar por transferencia
        </button>
        <button class="button button-secondary summary-button summary-button-secondary" type="button" data-whatsapp-checkout>
          Consultar por WhatsApp
        </button>
        <p class="cart-drawer-note">
          Una vez realizada la transferencia, envianos el comprobante por WhatsApp.
        </p>
      </div>
    `;
  }

  function createTransferModal() {
    const modalMarkup = `
      <div class="transfer-modal" data-transfer-modal hidden>
        <button class="transfer-modal-overlay" type="button" data-transfer-overlay data-close-transfer aria-label="Cerrar modal de transferencia"></button>
        <div class="transfer-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="transfer-modal-title">
          <button class="transfer-modal-close" type="button" data-close-transfer aria-label="Cerrar modal de transferencia">×</button>
          <p class="transfer-modal-kicker">Pago principal</p>
          <h2 id="transfer-modal-title">Transferencia bancaria</h2>
          <div class="transfer-modal-details">
            <div class="transfer-detail-row">
              <span>Banco</span>
              <strong>${BANK_TRANSFER.bank}</strong>
            </div>
            <div class="transfer-detail-row">
              <span>Titular</span>
              <strong>${BANK_TRANSFER.holder}</strong>
            </div>
            <div class="transfer-detail-row">
              <span>Cuenta</span>
              <strong data-transfer-account>${BANK_TRANSFER.account}</strong>
            </div>
            <div class="transfer-detail-row">
              <span>Alias</span>
              <strong>${BANK_TRANSFER.alias}</strong>
            </div>
          </div>
          <button class="button button-primary transfer-copy-button" type="button" data-copy-transfer>
            Copiar número de cuenta
          </button>
          <p class="transfer-copy-feedback" data-copy-feedback aria-live="polite"></p>
          <p class="transfer-modal-note">
            Una vez realizada la transferencia, envianos el comprobante por WhatsApp.
          </p>
          <button class="button button-secondary transfer-whatsapp-button" type="button" data-whatsapp-checkout>
          Finalizar pedido por WhatsApp
          </button>
        </div>
      </div>
    `;

    body.insertAdjacentHTML("beforeend", modalMarkup);
  }

  function createCartDrawer() {
    const drawerMarkup = `
      <button class="cart-overlay" type="button" data-cart-overlay aria-label="Cerrar carrito"></button>
      <aside class="cart-drawer" data-cart-drawer aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <div class="cart-drawer-header">
          <div>
            <p class="cart-drawer-kicker">Carrito</p>
            <h2 id="cart-drawer-title">Tu selección</h2>
          </div>
          <button class="cart-drawer-close" type="button" data-close-cart aria-label="Cerrar carrito">×</button>
        </div>
        <div class="cart-drawer-items" data-drawer-items aria-live="polite"></div>
        <div class="cart-drawer-summary" data-drawer-summary aria-live="polite"></div>
      </aside>
    `;

    body.insertAdjacentHTML("beforeend", drawerMarkup);
  }

  cartLinks.forEach((link) => {
    link.classList.add("cart-link");
    link.setAttribute("data-open-cart", "true");

    if (!link.querySelector("[data-cart-count]")) {
      link.insertAdjacentHTML(
        "beforeend",
        ' <span class="cart-count" data-cart-count hidden>0</span>'
      );
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      openDrawer();
    });
  });

  drawerItems.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-cart-action]");

    if (!actionButton) {
      return;
    }

    const productId = Number(actionButton.dataset.productId);
    const action = actionButton.dataset.cartAction;
    const currentItem = HuellasCart.getCart().find((item) => item.id === productId);

    if (!currentItem) {
      return;
    }

    if (action === "increase") {
      HuellasCart.updateQuantity(productId, currentItem.quantity + 1);
    }

    if (action === "decrease") {
      HuellasCart.updateQuantity(productId, currentItem.quantity - 1);
    }

    if (action === "remove") {
      HuellasCart.removeProduct(productId);
    }
  });

  drawerSummary.addEventListener("click", (event) => {
    const transferButton = event.target.closest("[data-transfer-checkout]");
    const checkoutButton = event.target.closest("[data-whatsapp-checkout]");

    if (transferButton) {
      openTransferModal();
      return;
    }

    if (!checkoutButton) {
      return;
    }

    openWhatsAppCheckout();
  });

  overlay.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);
  transferOverlay?.addEventListener("click", closeTransferModal);
  transferCloseButtons.forEach((button) => {
    button.addEventListener("click", closeTransferModal);
  });
  transferCopyButton?.addEventListener("click", copyTransferAccount);
  transferModal?.addEventListener("click", (event) => {
    const whatsappButton = event.target.closest("[data-whatsapp-checkout]");

    if (whatsappButton) {
      closeTransferModal();
      openWhatsAppCheckout();
      return;
    }

    if (event.target === transferModal) {
      closeTransferModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && transferModal && !transferModal.hidden) {
      closeTransferModal();
      return;
    }

    if (event.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  window.addEventListener("huellas:cart-updated", renderDrawer);
  window.addEventListener("huellas:open-cart", openDrawer);

  if (window.location.pathname.endsWith("/carrito.html") || window.location.pathname.endsWith("carrito.html")) {
    openDrawer();
  }

  renderDrawer();
});
