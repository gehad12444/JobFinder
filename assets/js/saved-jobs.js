/* ============================================
   saved-jobs.js — localStorage layer for the
   heart / save button. Reused later on the
   Jobs, Job Details and Saved Jobs pages.
   ============================================ */

const SAVED_JOBS_KEY = "savedJobs";

function getSavedJobIds() {
  return JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || "[]");
}

function isJobSaved(id) {
  return getSavedJobIds().includes(id);
}

function toggleSavedJob(id) {
  let saved = getSavedJobIds();
  saved = saved.includes(id) ? saved.filter((j) => j !== id) : [...saved, id];
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(saved));
  return saved;
}

function clearAllSavedJobs() {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify([]));
}

/** attaches click handlers to every .fav-btn inside a given container */
function initSaveButtons(container) {
  container.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest("[data-id]");
      const id = Number(card.dataset.id);
      const saved = toggleSavedJob(id);
      const active = saved.includes(id);
      btn.classList.toggle("active", active);
      btn.querySelector("i").className = `fa-${active ? "solid" : "regular"} fa-heart`;
    });
  });
}
