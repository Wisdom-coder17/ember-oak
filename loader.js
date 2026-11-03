(() => {
  const start = performance.now();
  const loader = document.createElement("div");
  loader.className = "cooking-loader";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-live", "polite");
  loader.innerHTML = `
    <div class="cooking-loader__inner">
      <p class="cooking-loader__brand">EMBER &amp; OAK</p>
      <div class="cooking-scene" aria-hidden="true">
        <span class="cooking-steam one"></span><span class="cooking-steam two"></span><span class="cooking-steam three"></span>
        <span class="cooking-flame one"></span><span class="cooking-flame two"></span><span class="cooking-flame three"></span>
        <div class="cooking-pan"><span class="cooking-food"></span></div>
      </div>
      <p class="cooking-loader__message">Something delicious is on the way.</p>
      <p class="cooking-loader__sub">Fresh from our kitchen</p>
      <div class="cooking-loader__track"><span></span></div>
    </div>`;
  document.documentElement.classList.add("is-loading");
  const mount = () => { if (!loader.isConnected) document.body.prepend(loader); document.body.classList.add("is-loading"); };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount, {once:true});
  const hide = () => {
    const remaining = Math.max(0, 950 - (performance.now() - start));
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body?.classList.remove("is-loading");
      document.documentElement.classList.remove("is-loading");
      window.setTimeout(() => loader.remove(), 650);
    }, remaining);
  };
  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide, {once:true});
  window.setTimeout(hide, 7000);
})();