window.addEventListener("load", () => {
  const loader = document.querySelector("[data-site-loader]");

  if (!loader) {
    return;
  }

  window.setTimeout(() => {
    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 720);
  }, 2200);
});
