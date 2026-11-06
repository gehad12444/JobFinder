/* ============================================
   jobs-page.js — entry point for pages/jobs.html.
   Wires api.js + brands.js + saved-jobs.js +
   jobs-filters.js + jobs-sort.js + jobs-pagination.js
   together. No fetch or DOM-building logic that
   belongs in those modules lives here.
   ============================================ */

const JOBS_PER_PAGE = 4;

let allJobs = [];
let currentPage = 1;

function jobListItemTemplate(job) {
  const saved = isJobSaved(job.id);

  return `
  <div class="job-list-item" data-id="${job.id}">
    ${companyIconHTML(job)}
    <div class="job-list-info">
      <div class="job-list-top">
        <h3><a href="job-details.html?id=${job.id}">${job.title}</a></h3>
        <button class="fav-btn ${saved ? "active" : ""}" aria-label="Save job">
          <i class="fa-${saved ? "solid" : "regular"} fa-heart"></i>
        </button>
      </div>
      <div class="job-list-company">${job.company} <i class="fa-solid fa-circle-check verified"></i></div>
      <div class="meta">
        <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
        <span><i class="fa-regular fa-clock"></i> ${job.type}</span>
        <span><i class="fa-solid fa-layer-group"></i> ${job.experience}</span>
      </div>
      <div class="skills">
        ${job.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
      </div>
    </div>
    <div class="job-list-side">
      <div class="salary">${formatSalary(job.salaryMin, job.salaryMax)}</div>
      <div class="posted">${timeAgo(job.postedDate)}</div>
      <a class="btn btn-primary btn-sm" href="job-details.html?id=${job.id}">View Details</a>
    </div>
  </div>`;
}

function renderJobsList() {
  const searchQuery = document.getElementById("jobsSearchTitle").value.trim();
  const locationQuery = document.getElementById("jobsSearchLocation").value.trim();
  const filters = getActiveFilters();
  const sortBy = document.getElementById("sortSelect").value;

  let result = filterJobs(allJobs, filters, searchQuery, locationQuery);
  result = sortJobs(result, sortBy);

  const list = document.getElementById("jobsList");
  const count = document.getElementById("resultsCount");
  count.textContent = `Showing ${result.length} job${result.length === 1 ? "" : "s"}`;

  const pageItems = paginate(result, currentPage, JOBS_PER_PAGE);

  if (!pageItems.length) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>No jobs match your filters right now.</p>
        <button class="btn btn-outline" id="emptyClearBtn">Clear filters</button>
      </div>`;
    const emptyBtn = document.getElementById("emptyClearBtn");
    if (emptyBtn) {
      emptyBtn.addEventListener("click", () => {
        document.getElementById("clearFilters").click();
      });
    }
  } else {
    list.innerHTML = pageItems.map(jobListItemTemplate).join("");
    initSaveButtons(list);
  }

  renderPagination(result.length, JOBS_PER_PAGE, currentPage, (page) => {
    currentPage = page;
    renderJobsList();
    document.querySelector(".jobs-layout").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function handleChange() {
  currentPage = 1;
  renderJobsList();
}

async function initJobsPage() {
  const params = new URLSearchParams(window.location.search);
  const searchInput = document.getElementById("jobsSearchTitle");
  const locationInput = document.getElementById("jobsSearchLocation");

  if (params.get("search")) searchInput.value = params.get("search");
  if (params.get("location")) locationInput.value = params.get("location");

  const [jobs, categories] = await Promise.all([
    getAllJobs(),
    fetch("/data/categories.json").then((r) => r.json()),
  ]);

  allJobs = params.get("featured") === "true" ? jobs.filter((j) => j.isFeatured) : jobs;

  buildFilterOptions(allJobs, categories);

  const categoryParam = params.get("category");
  if (categoryParam) {
    const cb = document.querySelector(
      `#categoryFilters input[value="${CSS.escape(categoryParam)}"]`
    );
    if (cb) cb.checked = true;
  }

  updateFilterCountBadge();
  renderJobsList();

  initFiltersPanel(handleChange);
  initSort(handleChange);
  initMobileFilters();

  document.getElementById("jobsSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleChange();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initBackToTop();
  initJobsPage();
});
