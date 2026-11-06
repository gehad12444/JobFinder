/* ============================================
   testimonials.js — "What our users say"
   ============================================ */

function testimonialTemplate(t) {
  const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);

  return `
  <div class="testimonial-card">
    <div class="stars">${stars}</div>
    <p>"${t.quote}"</p>
    <div class="person">
      <span class="avatar">${t.name.charAt(0)}</span>
      <div><strong>${t.name}</strong><small>${t.role}</small></div>
    </div>
  </div>`;
}

async function loadTestimonials() {
  const wrap = document.getElementById("testimonialCards");

  try {
    const res = await fetch("/data/testimonials.json");
    if (!res.ok) throw new Error("Network response was not ok");
    const items = await res.json();
    wrap.innerHTML = items.map(testimonialTemplate).join("");
  } catch (err) {
    console.error("Failed to load testimonials:", err);
    wrap.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load testimonials right now.</p>`;
  }
}

function initTestimonials() {
  loadTestimonials();
}
