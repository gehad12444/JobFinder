/* ============================================
   theme.js — dark / light mode
   ============================================ */

function initTheme() {
  const toggleBtn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");

  if (saved === "dark") document.body.classList.add("dark");
  updateThemeIcon();

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  const icon = document.querySelector("#themeToggle i");
  const isDark = document.body.classList.contains("dark");
  icon.className = isDark ? "fa-solid fa-sun" : "fa-regular fa-moon";
}
