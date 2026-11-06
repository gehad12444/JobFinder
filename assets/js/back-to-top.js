/* ============================================
   back-to-top.js — floating button that fades
   in after scrolling, scrolls back to the top
   ============================================ */

function initBackToTop() {
  const btn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
