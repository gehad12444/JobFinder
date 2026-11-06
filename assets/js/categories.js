/* ============================================
   categories.js — fetches data/categories.json
   and renders the category cards
   ============================================ */

const CATEGORIES_URL = "/data/categories.json";

async function loadCategories() {
  const grid = document.getElementById("categoryGrid");

  try {
    const res = await fetch(CATEGORIES_URL);
    if (!res.ok) throw new Error("Network response was not ok");
    const categories = await res.json();

    grid.innerHTML = categories
      .map(
        (cat) => `
      <a class="category-card" href="pages/jobs.html?category=${encodeURIComponent(cat.name)}">
        <i class="fa-solid ${cat.icon} icon ${cat.color}"></i>
        <h3>${cat.name}</h3>
        <p>${cat.count.toLocaleString()} jobs <i class="fa-solid fa-arrow-right"></i></p>
      </a>`
      )
      .join("");
  } catch (err) {
    console.error("Failed to load categories:", err);
    grid.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load categories right now.</p>`;
  }
}

function initCategories() {
  loadCategories();
}
