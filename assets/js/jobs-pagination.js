/* ============================================
   jobs-pagination.js — slices the list into
   pages and renders the page-number buttons.
   ============================================ */

function paginate(items, page, perPage) {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

function renderPagination(totalItems, perPage, currentPage, onPageChange) {
  const wrap = document.getElementById("pagination");
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  if (totalPages <= 1) {
    wrap.innerHTML = "";
    return;
  }

  const pageBtn = (page, label, disabled = false) => `
    <button class="page-btn ${page === currentPage ? "active" : ""}" data-page="${page}" ${disabled ? "disabled" : ""}>
      ${label}
    </button>`;

  let html = pageBtn(currentPage - 1, `<i class="fa-solid fa-chevron-left"></i>`, currentPage === 1);
  for (let i = 1; i <= totalPages; i++) {
    html += pageBtn(i, i);
  }
  html += pageBtn(currentPage + 1, `<i class="fa-solid fa-chevron-right"></i>`, currentPage === totalPages);

  wrap.innerHTML = html;

  wrap.querySelectorAll(".page-btn:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => onPageChange(Number(btn.dataset.page)));
  });
}
