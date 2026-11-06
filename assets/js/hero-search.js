/* ============================================
   hero-search.js — hero search bar behaviour
   ============================================ */

function initSearch() {
  const form = document.getElementById("heroSearchForm");
  const btn = document.getElementById("searchBtn");
  const btnLabel = btn.querySelector(".btn-label");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("searchTitle").value.trim();
    const location = document.getElementById("searchLocation").value.trim();

    const params = new URLSearchParams();
    if (title) params.set("search", title);
    if (location) params.set("location", location);

    btn.disabled = true;
    btnLabel.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Searching...`;

    setTimeout(() => {
      window.location.href = `pages/jobs.html?${params.toString()}`;
    }, 500);
  });
}
