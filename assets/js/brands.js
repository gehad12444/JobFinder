/* ============================================
   brands.js — builds the colored company icon
   for a job. Colors live in components.css as
   classes (brand-google, brand-amazon, ...),
   this file only decides which markup to use.
   Reused later by Latest Jobs, Jobs page, etc.
   ============================================ */

function companyIconHTML(job) {
  const brand = job.brand;

  if (brand === "microsoft") {
    return `
    <div class="company-icon brand-microsoft">
      <svg viewBox="0 0 44 44" width="22" height="22" aria-hidden="true">
        <rect x="2"  y="2"  width="18" height="18" fill="#F25022"/>
        <rect x="24" y="2"  width="18" height="18" fill="#7FBA00"/>
        <rect x="2"  y="24" width="18" height="18" fill="#00A4EF"/>
        <rect x="24" y="24" width="18" height="18" fill="#FFB900"/>
      </svg>
    </div>`;
  }

  if (brand === "google") {
    return `<div class="company-icon brand-google"><i class="fa-brands fa-google"></i></div>`;
  }

  if (brand === "notion" || brand === "netflix") {
    return `<div class="company-icon brand-${brand}"><span class="letter-icon">${job.company.charAt(0)}</span></div>`;
  }

  return `<div class="company-icon brand-${brand}"><i class="fa-brands ${job.companyIcon}"></i></div>`;
}
