/* ============================================
   companies.js — "Top Companies Hiring" strip.
   Fetches data/companies.json and lets the
   arrows scroll the row left/right.
   ============================================ */

function companyChipTemplate(company) {
  const key = company.name.toLowerCase();

  if (company.icon === "ms-logo") {
    return `
    <div class="company-chip ${key}">
      <svg viewBox="0 0 44 44" width="26" height="26" aria-hidden="true">
        <rect x="2"  y="2"  width="18" height="18" fill="#F25022"/>
        <rect x="24" y="2"  width="18" height="18" fill="#7FBA00"/>
        <rect x="2"  y="24" width="18" height="18" fill="#00A4EF"/>
        <rect x="24" y="24" width="18" height="18" fill="#FFB900"/>
      </svg>
    </div>`;
  }

  if (company.icon) {
    return `<div class="company-chip ${key}"><i class="fa-brands ${company.icon}"></i></div>`;
  }

  return `<div class="company-chip ${key}"><span class="wordmark">${company.name}</span></div>`;
}

async function loadCompanies() {
  const row = document.getElementById("companiesRow");

  try {
    const res = await fetch("/data/companies.json");
    if (!res.ok) throw new Error("Network response was not ok");
    const companies = await res.json();
    row.innerHTML = companies.map(companyChipTemplate).join("");
  } catch (err) {
    console.error("Failed to load companies:", err);
    row.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load companies right now.</p>`;
  }
}

function initCompaniesScroll() {
  const row = document.getElementById("companiesRow");
  const step = 150;

  document.getElementById("compNext").addEventListener("click", () => {
    row.scrollBy({ left: step, behavior: "smooth" });
  });
  document.getElementById("compPrev").addEventListener("click", () => {
    row.scrollBy({ left: -step, behavior: "smooth" });
  });
}

function initCompanies() {
  loadCompanies();
  initCompaniesScroll();
}
