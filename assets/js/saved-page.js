/* ============================================
   saved-page.js — entry point for
   pages/saved.html. Reads the saved job ids
   from localStorage (saved-jobs.js) and shows
   the matching jobs from api.js.
   ============================================ */

function savedJobCardTemplate(job) {
  return `
  <div class="job-card" data-id="${job.id}">
    <div class="job-card-top">
      ${companyIconHTML(job)}
      <div class="company-name">${job.company} <i class="fa-solid fa-circle-check verified"></i></div>
      <button class="fav-btn active" aria-label="Remove from saved jobs">
        <i class="fa-solid fa-heart"></i>
      </button>
    </div>
    <h3><a href="job-details.html?id=${job.id}">${job.title}</a></h3>
    <div class="meta">
      <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
      <span><i class="fa-regular fa-clock"></i> ${job.type}</span>
    </div>
    <div class="salary">${formatSalary(job.salaryMin, job.salaryMax)}</div>
    <div class="skills">
      ${job.skills.slice(0, 3).map((s) => `<span class="skill-tag">${s}</span>`).join("")}
    </div>
    <div class="job-card-footer">
      <span class="posted">${timeAgo(job.postedDate)}</span>
      <a class="btn btn-outline btn-sm" href="job-details.html?id=${job.id}">View Details</a>
    </div>
  </div>`;
}

function emptySavedTemplate() {
  return `
  <div class="empty-state">
    <i class="fa-regular fa-heart"></i>
    <p>You haven't saved any jobs yet.</p>
    <a class="btn btn-outline" href="jobs.html">Browse Jobs</a>
  </div>`;
}

function updateSavedCount(count) {
  document.getElementById("savedCount").textContent = count;
  document.getElementById("clearSavedBtn").classList.toggle("hidden", count === 0);
}

function removeSavedCard(card) {
  card.classList.add("removing");
  card.addEventListener(
    "transitionend",
    () => {
      const grid = document.getElementById("savedJobsGrid");
      card.remove();

      const remaining = grid.querySelectorAll(".job-card").length;
      updateSavedCount(remaining);
      if (remaining === 0) grid.innerHTML = emptySavedTemplate();
    },
    { once: true }
  );
}

function attachSavedCardEvents(grid) {
  grid.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest("[data-id]");
      const id = Number(card.dataset.id);
      toggleSavedJob(id);
      removeSavedCard(card);
    });
  });
}

async function loadSavedJobs() {
  const grid = document.getElementById("savedJobsGrid");
  const savedIds = getSavedJobIds();

  updateSavedCount(savedIds.length);

  if (!savedIds.length) {
    grid.innerHTML = emptySavedTemplate();
    return;
  }

  try {
    const allJobs = await getAllJobs();
    const savedJobs = savedIds
      .map((id) => allJobs.find((job) => job.id === id))
      .filter(Boolean)
      .reverse(); // most recently saved first

    if (!savedJobs.length) {
      grid.innerHTML = emptySavedTemplate();
      updateSavedCount(0);
      return;
    }

    grid.innerHTML = savedJobs.map(savedJobCardTemplate).join("");
    attachSavedCardEvents(grid);
  } catch (err) {
    console.error("Failed to load saved jobs:", err);
    grid.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load your saved jobs right now.</p>`;
  }
}

function initClearAll() {
  const btn = document.getElementById("clearSavedBtn");
  const overlay = document.getElementById("clearSavedOverlay");
  const cancelBtn = document.getElementById("clearSavedCancel");
  const confirmBtn = document.getElementById("clearSavedConfirm");

  btn.addEventListener("click", () => overlay.classList.add("show"));
  cancelBtn.addEventListener("click", () => overlay.classList.remove("show"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("show");
  });

  confirmBtn.addEventListener("click", () => {
    clearAllSavedJobs();
    overlay.classList.remove("show");
    loadSavedJobs();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initBackToTop();
  loadSavedJobs();
  initClearAll();
});
