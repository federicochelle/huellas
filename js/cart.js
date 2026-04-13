const HUELLAS_WHATSAPP_NUMBER = "59896303052";

const HuellasCart = (() => {
  const STORAGE_KEY = "huellas-cart";

  function notifyCartUpdated(cart) {
    // Broadcasts cart changes so the header badge and drawer stay in sync.
    window.dispatchEvent(
      new CustomEvent("huellas:cart-updated", {
        detail: { cart }
      })
    );
  }

  function getCart() {
    const rawCart = localStorage.getItem(STORAGE_KEY);

    if (!rawCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(rawCart);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    notifyCartUpdated(cart);
  }

  function addProduct(productId) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === productId);

    // If the product is already in the cart, we simply increase its quantity.
    if (existingItem) {
      existingItem.quantity += 1;
      saveCart(cart);
      return cart;
    }

    cart.push({ id: productId, quantity: 1 });
    saveCart(cart);
    return cart;
  }

  function updateQuantity(productId, quantity) {
    const cart = getCart();
    const safeQuantity = Math.max(0, Number(quantity) || 0);
    const item = cart.find((entry) => entry.id === productId);

    if (!item) {
      return cart;
    }

    if (safeQuantity === 0) {
      return removeProduct(productId);
    }

    item.quantity = safeQuantity;
    saveCart(cart);
    return cart;
  }

  function removeProduct(productId) {
    const updatedCart = getCart().filter((item) => item.id !== productId);
    saveCart(updatedCart);
    return updatedCart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getItemCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
  }

  return {
    addProduct,
    clearCart,
    getCart,
    getItemCount,
    removeProduct,
    updateQuantity
  };
})();
