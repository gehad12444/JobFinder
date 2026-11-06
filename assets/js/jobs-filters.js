/* ============================================
   jobs-filters.js — builds the filter checkboxes
   from the real job data, and filters the list.
   ============================================ */

function buildCheckboxGroup(containerId, name, values) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = values
    .map(
      (v) => `
    <label class="filter-option">
      <input type="checkbox" name="${name}" value="${v}">
      <span>${v}</span>
    </label>`
    )
    .join("");
}

function buildFilterOptions(jobs, categories) {
  const locations = [...new Set(jobs.map((j) => j.location))].sort();
  const types = [...new Set(jobs.map((j) => j.type))].sort();
  const experienceLevels = ["Junior", "Mid", "Senior"];
  const categoryNames = categories.map((c) => c.name);

  buildCheckboxGroup("locationFilters", "location", locations);
  buildCheckboxGroup("experienceFilters", "experience", experienceLevels);
  buildCheckboxGroup("typeFilters", "type", types);
  buildCheckboxGroup("categoryFilters", "category", categoryNames);
}

function getActiveFilters() {
  const panel = document.getElementById("filtersPanel");
  const values = (name) =>
    [...panel.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);

  return {
    locations: values("location"),
    experience: values("experience"),
    types: values("type"),
    categories: values("category"),
  };
}

function filterJobs(jobs, filters, searchQuery, locationQuery) {
  return jobs.filter((job) => {
    if (filters.locations.length && !filters.locations.includes(job.location)) return false;
    if (filters.experience.length && !filters.experience.includes(job.experience)) return false;
    if (filters.types.length && !filters.types.includes(job.type)) return false;
    if (filters.categories.length && !filters.categories.includes(job.category)) return false;

    if (searchQuery) {
      const haystack = `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase();
      if (!haystack.includes(searchQuery.toLowerCase())) return false;
    }

    if (locationQuery && !job.location.toLowerCase().includes(locationQuery.toLowerCase())) {
      return false;
    }

    return true;
  });
}

function getActiveFilterCount() {
  const f = getActiveFilters();
  return f.locations.length + f.experience.length + f.types.length + f.categories.length;
}

function updateFilterCountBadge() {
  const badge = document.getElementById("filterCount");
  if (!badge) return;
  const count = getActiveFilterCount();
  badge.textContent = count || "";
  badge.classList.toggle("show", count > 0);
}

function initFiltersPanel(onChange) {
  const panel = document.getElementById("filtersPanel");

  panel.addEventListener("change", () => {
    updateFilterCountBadge();
    onChange();
  });

  document.getElementById("clearFilters").addEventListener("click", () => {
    panel.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateFilterCountBadge();
    onChange();
  });
}
