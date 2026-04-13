window.addEventListener("load", () => {
  const loader = document.querySelector("[data-site-loader]");
  const sessionKey = "huellas-home-loader-shown";

  if (!loader) {
    return;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0];
  const isReload = navigationEntry?.type === "reload";
  const hasShownInSession = sessionStorage.getItem(sessionKey) === "true";

  if (hasShownInSession && !isReload) {
    loader.remove();
    return;
  }

  sessionStorage.setItem(sessionKey, "true");

  window.setTimeout(() => {
    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 720);
  }, 2200);
});
