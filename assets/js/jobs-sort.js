/* ============================================
   jobs-sort.js — sorts the (already filtered)
   job list based on the dropdown value.
   ============================================ */

function sortJobs(jobs, sortBy) {
  const list = [...jobs];

  switch (sortBy) {
    case "salary-high":
      return list.sort((a, b) => b.salaryMax - a.salaryMax);
    case "salary-low":
      return list.sort((a, b) => a.salaryMin - b.salaryMin);
    case "az":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "oldest":
      return list.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    case "newest":
    default:
      return list.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  }
}

function initSort(onChange) {
  document.getElementById("sortSelect").addEventListener("change", onChange);
}
