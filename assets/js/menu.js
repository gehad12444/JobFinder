/* ============================================
   menu.js — mobile nav toggle
   ============================================ */

function initMenu() {
  const btn = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");

  btn.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
}
