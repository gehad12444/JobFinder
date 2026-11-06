/* ============================================
   newsletter.js — fake subscribe flow with an
   inline success state instead of alert()
   ============================================ */

function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const btn = document.getElementById("newsletterBtn");
  const originalLabel = btn.textContent;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    btn.disabled = true;
    btn.classList.add("success");
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Subscribed`;

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.classList.remove("success");
      btn.textContent = originalLabel;
    }, 2200);
  });
}
