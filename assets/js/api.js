/* ============================================
   api.js — single place that talks to data/jobs.json
   Every other module calls these functions instead
   of writing its own fetch().
   ============================================ */

const JOBS_URL = "/data/jobs.json";

async function getAllJobs() {
  const res = await fetch(JOBS_URL);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

async function getFeaturedJobs() {
  const jobs = await getAllJobs();
  return jobs.filter((job) => job.isFeatured);
}

async function getLatestJobs(limit = 5) {
  const jobs = await getAllJobs();
  return [...jobs]
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    .slice(0, limit);
}

async function getJobById(id) {
  const jobs = await getAllJobs();
  return jobs.find((job) => String(job.id) === String(id));
}

async function getRelatedJobs(job, limit = 3) {
  const jobs = await getAllJobs();
  return jobs
    .filter((j) => j.id !== job.id && j.category === job.category)
    .slice(0, limit);
}

function formatSalary(min, max) {
  const fmt = (n) => Number(n).toLocaleString("en-US");
  return `EGP ${fmt(min)} - ${fmt(max)}`;
}

function timeAgo(dateStr) {
  const posted = new Date(dateStr);
  const now = new Date();
  const diffHrs = Math.floor((now - posted) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
