/* ============================================
   contact-page.js — entry point for
   pages/contact.html. No backend: the form
   just shows a success modal and resets.
   ============================================ */

function initContactForm() {
  const form = document.getElementById("contactForm");
  const overlay = document.getElementById("contactModalOverlay");
  const text = document.getElementById("contactModalText");
  const closeBtn = document.getElementById("contactModalClose");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();

    text.textContent = `Thanks, ${name.split(" ")[0]}! Your message about "${subject}" has been recorded. Our team will get back to you soon.`;
    overlay.classList.add("show");
    form.reset();
  });

  const close = () => overlay.classList.remove("show");
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initBackToTop();
  initContactForm();
});
