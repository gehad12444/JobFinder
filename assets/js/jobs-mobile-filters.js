/* ============================================
   jobs-mobile-filters.js — turns the filters
   sidebar into a slide-in drawer on small screens
   ============================================ */

function initMobileFilters() {
  const panel = document.getElementById("filtersPanel");
  const overlay = document.getElementById("filtersOverlay");
  const openBtn = document.getElementById("openFilters");
  const closeBtn = document.getElementById("closeFilters");

  const open = () => {
    panel.classList.add("show");
    overlay.classList.add("show");
  };
  const close = () => {
    panel.classList.remove("show");
    overlay.classList.remove("show");
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);
}
