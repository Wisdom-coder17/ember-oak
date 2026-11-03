const grid = document.querySelector("#menu-grid");
const searchInput = document.querySelector("#menu-search");
const sortSelect = document.querySelector("#menu-sort");
const categoryButtons = [...document.querySelectorAll("[data-category]")];
const resultCount = document.querySelector("#result-count");
const clearButton = document.querySelector("#clear-filters");
const emptyState = document.querySelector("#empty-state");
const resetButton = document.querySelector("#reset-menu");

let menuItems = [];
let activeCategory = "all";
let searchTerm = "";

const money = (amount) => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 0
}).format(Number(amount) || 0);

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function dishCard(item, index) {
  const category = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  const tags = (item.tags || []).slice(0, 2).map((t) => `<span>${safeText(t)}</span>`).join("");
  return `
    <a class="dish-card" href="item.html?id=${encodeURIComponent(item.id)}" style="animation-delay:${Math.min(index * 35, 280)}ms" aria-label="View ${safeText(item.name)} details">
      <div class="dish-image">
        <img src="${safeText(item.image)}" alt="${safeText(item.alt || item.name)}" loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/900x600/25241e/d5ad68?text=Ember+%26+Oak'">
        ${item.featured ? `<span class="dish-tag">✦ House favourite</span>` : `<span class="dish-tag">${safeText(category)}</span>`}
      </div>
      <div class="dish-content">
        <div class="dish-meta"><span class="dish-category">${safeText(category)}</span><span class="dish-price">${money(item.price)}</span></div>
        <h3>${safeText(item.name)}</h3>
        <p>${safeText(item.description)}</p>
        <div class="dish-bottom"><div class="dish-tags">${tags}</div><span class="dish-id">View details ↗</span></div>
      </div>
    </a>`;
}

function filteredItems() {
  let result = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const haystack = `${item.name} ${item.description} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
    return matchesCategory && haystack.includes(searchTerm.toLowerCase());
  });
  switch (sortSelect.value) {
    case "price-low": result.sort((a, b) => a.price - b.price); break;
    case "price-high": result.sort((a, b) => b.price - a.price); break;
    case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id));
  }
  return result;
}

function renderMenu() {
  const items = filteredItems();
  grid.innerHTML = items.map(dishCard).join("");
  resultCount.textContent = `${items.length} ${items.length === 1 ? "dish" : "dishes"} to discover`;
  emptyState.hidden = items.length !== 0;
  grid.hidden = items.length === 0;
  clearButton.hidden = activeCategory === "all" && searchTerm === "";
  categoryButtons.forEach((button) => {
    const active = button.dataset.category === activeCategory;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

async function loadMenu() {
  try {
    const response = await fetch("menu.json");
    if (!response.ok) throw new Error("Could not load menu.json");
    const data = await response.json();
    const stored = JSON.parse(localStorage.getItem("emberOakMenu") || "null");
    menuItems = (stored || data.items).filter((item) => item.available !== false);
    renderMenu();
  } catch (error) {
    grid.innerHTML = `<div class="loading-card">We couldn't load the menu data. Open this folder with VS Code Live Server, then refresh.</div>`;
    resultCount.textContent = "Menu data unavailable";
    console.error(error);
  }
}
categoryButtons.forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.category; renderMenu();
}));
searchInput.addEventListener("input", () => { searchTerm = searchInput.value.trim(); renderMenu(); });
sortSelect.addEventListener("change", renderMenu);
function resetFilters() {
  activeCategory = "all"; searchTerm = ""; searchInput.value = ""; sortSelect.value = "recommended"; renderMenu();
}
clearButton.addEventListener("click", resetFilters);
resetButton.addEventListener("click", resetFilters);
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault(); searchInput.focus();
  }
});
loadMenu();