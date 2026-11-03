(() => {
  const slides = [...document.querySelectorAll(".carousel-slide")];
  const dots = [...document.querySelectorAll("[data-slide-to]")];
  const current = document.querySelector("[data-slide-current]");
  let active = 0;
  let timer;
  function showSlide(index) {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle("is-active", selected);
      slide.setAttribute("aria-hidden", String(!selected));
    });
    dots.forEach((dot, i) => {
      const selected = i === active;
      dot.classList.toggle("is-active", selected);
      if (selected) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (current) current.textContent = String(active + 1).padStart(2, "0");
  }
  function restart() { window.clearInterval(timer); timer = window.setInterval(() => showSlide(active + 1), 5500); }
  document.querySelector("[data-slide-prev]")?.addEventListener("click", () => { showSlide(active - 1); restart(); });
  document.querySelector("[data-slide-next]")?.addEventListener("click", () => { showSlide(active + 1); restart(); });
  dots.forEach(dot => dot.addEventListener("click", () => { showSlide(Number(dot.dataset.slideTo)); restart(); }));
  const carousel = document.querySelector(".home-carousel");
  carousel?.addEventListener("mouseenter", () => window.clearInterval(timer));
  carousel?.addEventListener("mouseleave", restart);
  carousel?.addEventListener("focusin", () => window.clearInterval(timer));
  carousel?.addEventListener("focusout", restart);
  showSlide(0); restart();

  const host = document.querySelector("#home-featured-dishes");
  const money = amount => new Intl.NumberFormat("en-NG", {style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(amount) || 0);
  const safe = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  async function loadHomeMenu() {
    if (!host) return;
    try {
      const response = await fetch("menu.json");
      if (!response.ok) throw new Error("Menu data could not be loaded");
      const data = await response.json();
      const items = data.items || [];
      const mains = items.find(item => item.category === "mains");
      const seafood = items.find(item => item.category === "seafood");
      const dessert = items.find(item => item.category === "desserts");
      const picks = [mains, seafood, dessert].filter(Boolean);
      picks.forEach((item, index) => {
        if (slides[index] && item.image) {
          slides[index].style.backgroundImage = `url("${item.image}")`;
          slides[index].dataset.menuItem = item.id;
        }
      });
      const featured = items.filter(item => item.featured && item.available !== false).slice(0, 3);
      const display = featured.length ? featured : items.filter(item => item.available !== false).slice(0, 3);
      host.innerHTML = display.map((item, index) => `
        <a class="dish-card" href="item.html?id=${encodeURIComponent(item.id)}">
          <div class="dish-image"><img src="${safe(item.image)}" alt="${safe(item.alt || item.name)}" loading="lazy"><span class="dish-number">${String(index+1).padStart(2,"0")}</span></div>
          <div class="dish-meta"><div><h3>${safe(item.name)}</h3><p>${safe(item.description)}</p></div><strong>${money(item.price)}</strong></div>
        </a>`).join("");
    } catch (error) {
      host.innerHTML = '<p class="home-menu-loading">Our menu is taking a moment to arrive. Please visit the full menu.</p>';
      console.error(error);
    }
  }
  loadHomeMenu();
})();