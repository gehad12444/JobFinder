/* ============================================
   featured-jobs.js — Featured Jobs carousel.
   Jobs are grouped into pages of 3. The arrows
   slide the whole page left/right (looping),
   so each click reveals the next 3 jobs.
   ============================================ */

const FEATURED_PAGE_SIZE = 3;

let featuredJobs = [];
let featuredPage = 0;

function jobCardTemplate(job) {
  const saved = isJobSaved(job.id);

  return `
  <div class="job-card" data-id="${job.id}">
    <div class="job-card-top">
      ${companyIconHTML(job)}
      <div class="company-name">${job.company} <i class="fa-solid fa-circle-check verified"></i></div>
      <button class="fav-btn ${saved ? "active" : ""}" aria-label="Save job">
        <i class="fa-${saved ? "solid" : "regular"} fa-heart"></i>
      </button>
    </div>
    <h3>${job.title}</h3>
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
      <a class="btn btn-outline btn-sm" href="pages/job-details.html?id=${job.id}">View Details</a>
    </div>
  </div>`;
}

function chunk(list, size) {
  const groups = [];
  for (let i = 0; i < list.length; i += size) {
    groups.push(list.slice(i, i + size));
  }
  return groups;
}

async function loadFeaturedJobs() {
  const slider = document.getElementById("featuredSlider");
  slider.innerHTML = `
    <div class="featured-page">
      <div class="skeleton job-card-skeleton"></div>
      <div class="skeleton job-card-skeleton"></div>
      <div class="skeleton job-card-skeleton"></div>
    </div>`;

  try {
    featuredJobs = await getFeaturedJobs();
  } catch (err) {
    console.error("Failed to load featured jobs:", err);
    slider.innerHTML = `<p style="color:var(--ink-faint);padding:12px">Couldn't load featured jobs right now.</p>`;
    return;
  }

  if (!featuredJobs.length) {
    slider.innerHTML = `<p style="color:var(--ink-faint);padding:12px">No featured jobs yet.</p>`;
    return;
  }

  renderFeaturedPages();
}

function renderFeaturedPages() {
  const slider = document.getElementById("featuredSlider");
  const dotsWrap = document.getElementById("featDots");
  const pages = chunk(featuredJobs, FEATURED_PAGE_SIZE);

  slider.innerHTML = pages
    .map((pageJobs) => `<div class="featured-page">${pageJobs.map(jobCardTemplate).join("")}</div>`)
    .join("");

  dotsWrap.innerHTML = pages
    .map((_, i) => `<span class="dot" data-page="${i}"></span>`)
    .join("");

  initSaveButtons(slider);

  dotsWrap.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => goToFeaturedPage(Number(dot.dataset.page)));
  });

  goToFeaturedPage(0, false);
}

function goToFeaturedPage(page, animate = true) {
  const slider = document.getElementById("featuredSlider");
  const dotsWrap = document.getElementById("featDots");
  const totalPages = slider.children.length;
  if (!totalPages) return;

  featuredPage = (page + totalPages) % totalPages;

  slider.style.transition = animate ? "transform .55s cubic-bezier(.4,0,.2,1)" : "none";
  slider.style.transform = `translateX(-${featuredPage * 100}%)`;

  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === featuredPage));
}

function initFeaturedCarouselControls() {
  document.getElementById("featNext").addEventListener("click", () => {
    goToFeaturedPage(featuredPage + 1);
  });
  document.getElementById("featPrev").addEventListener("click", () => {
    goToFeaturedPage(featuredPage - 1);
  });
}

function initFeaturedJobs() {
  loadFeaturedJobs();
  initFeaturedCarouselControls();
}
