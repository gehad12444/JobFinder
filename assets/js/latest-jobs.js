/* ============================================
   latest-jobs.js — "Latest Jobs" list, sorted
   by postedDate (logic lives in api.js).
   ============================================ */

function latestItemTemplate(job) {
  const tagHtml = job.tag
    ? `<span class="tag tag-${job.tag.toLowerCase()}">${job.tag}</span>`
    : "";

  return `
  <a class="latest-item" href="pages/job-details.html?id=${job.id}">
    ${companyIconHTML(job)}
    <div class="info">
      <h4>${job.title}</h4>
      <div class="sub">
        <span>${job.company}</span>
        <span>${job.location}</span>
        <span>${job.type}</span>
        ${tagHtml}
      </div>
    </div>
    <div class="right">
      <div class="posted">${timeAgo(job.postedDate)}</div>
      <div class="salary">${formatSalary(job.salaryMin, job.salaryMax)}</div>
      <span class="details-link">Details <i class="fa-solid fa-arrow-right"></i></span>
    </div>
  </a>`;
}

async function loadLatestJobs() {
  const list = document.getElementById("latestList");
  list.innerHTML = `<div class="skeleton latest-skeleton"></div>`.repeat(5);

  let jobs;
  try {
    jobs = await getLatestJobs(5);
  } catch (err) {
    console.error("Failed to load latest jobs:", err);
    list.innerHTML = `<p style="padding:20px;color:var(--ink-faint)">Couldn't load the latest jobs right now.</p>`;
    return;
  }

  if (!jobs.length) {
    list.innerHTML = `<p style="padding:20px;color:var(--ink-faint)">No jobs added yet.</p>`;
    return;
  }

  list.innerHTML = jobs.map(latestItemTemplate).join("");
}

function initLatestJobs() {
  loadLatestJobs();
}
