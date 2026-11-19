/* ============================================
   menu.js — mobile nav toggle
   ============================================ */

function initMenu() {
  const btn = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  if (!btn || !nav) return;

  const icon = btn.querySelector("i");

  function setOpen(open) {
    nav.classList.toggle("show", open);
    btn.setAttribute("aria-expanded", open);
    icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  btn.addEventListener("click", () => setOpen(!nav.classList.contains("show")));

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => setOpen(false))
  );

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setOpen(false);
  });
}
