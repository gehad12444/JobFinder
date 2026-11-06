/* ============================================
   job-details.js — entry point for
   pages/job-details.html. Reads ?id= from the
   URL, fetches that job (api.js), and renders
   the whole page + the Apply flow.
   ============================================ */

function listBlock(title, iconClass, items) {
  return `
  <div class="detail-block">
    <h2><i class="fa-solid ${iconClass}"></i> ${title}</h2>
    <ul class="detail-list">
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>`;
}

function jobDetailsTemplate(job) {
  const saved = isJobSaved(job.id);
  const user = getUser();
  const applied = user ? isJobAppliedByEmail(user.email, job.id) : false;

  return `
  <div class="job-header-card" data-id="${job.id}">
    <div class="job-header-top">
      ${companyIconHTML(job)}
      <div class="job-header-info">
        <h1>${job.title}</h1>
        <div class="job-header-company">${job.company} <i class="fa-solid fa-circle-check verified"></i></div>
        <div class="meta">
          <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
          <span><i class="fa-regular fa-clock"></i> ${job.type}</span>
          <span><i class="fa-solid fa-layer-group"></i> ${job.experience}</span>
          <span><i class="fa-regular fa-calendar"></i> Posted ${timeAgo(job.postedDate)}</span>
        </div>
      </div>
      <button class="fav-btn header-fav-btn ${saved ? "active" : ""}" aria-label="Save job">
        <i class="fa-${saved ? "solid" : "regular"} fa-heart"></i>
      </button>
    </div>

    <div class="job-header-bottom">
      <div class="salary">${formatSalary(job.salaryMin, job.salaryMax)}</div>
      <div class="skills">
        ${job.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
      </div>
      <button class="btn btn-primary apply-btn ${applied ? "applied" : ""}" id="applyBtn">
        ${applied
          ? `<i class="fa-solid fa-circle-check"></i> Applied`
          : `<i class="fa-solid fa-paper-plane"></i> Apply Now`}
      </button>
    </div>
  </div>

  <div class="job-details-body">
    <main class="job-details-main">
      <div class="detail-block">
        <h2><i class="fa-solid fa-file-lines"></i> Job Description</h2>
        <p>${job.description}</p>
      </div>

      ${listBlock("Responsibilities", "fa-list-check", job.responsibilities)}
      ${listBlock("Requirements", "fa-clipboard-check", job.requirements)}
      ${listBlock("Benefits", "fa-gift", job.benefits)}
    </main>

    <aside class="job-details-side">
      <div class="side-card">
        <h3>Job Overview</h3>
        <ul class="overview-list">
          <li><i class="fa-solid fa-folder-open"></i><span>Category</span><strong>${job.category}</strong></li>
          <li><i class="fa-regular fa-clock"></i><span>Job Type</span><strong>${job.type}</strong></li>
          <li><i class="fa-solid fa-layer-group"></i><span>Experience</span><strong>${job.experience}</strong></li>
          <li><i class="fa-solid fa-location-dot"></i><span>Location</span><strong>${job.location}</strong></li>
          <li><i class="fa-solid fa-sack-dollar"></i><span>Salary</span><strong>${formatSalary(job.salaryMin, job.salaryMax)}</strong></li>
        </ul>
      </div>

      <div class="side-card">
        <h3>About ${job.company}</h3>
        <div class="about-company">
          ${companyIconHTML(job)}
          <p>${job.companyAbout}</p>
        </div>
      </div>

      <div class="side-card">
        <h3>Share this job</h3>
        <div class="socials">
          <a href="#" aria-label="Share on Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Share on Twitter"><i class="fa-brands fa-twitter"></i></a>
          <a href="#" aria-label="Share on LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="#" aria-label="Copy link"><i class="fa-solid fa-link"></i></a>
        </div>
      </div>
    </aside>
  </div>

  <section class="similar-jobs">
    <div class="section-head">
      <h2>Similar Jobs</h2>
      <a href="jobs.html?category=${encodeURIComponent(job.category)}" class="link-arrow">View more <i class="fa-solid fa-arrow-right"></i></a>
    </div>
    <div class="similar-jobs-grid" id="similarJobsGrid"></div>
  </section>`;
}

function similarJobCardTemplate(job) {
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
      <a class="btn btn-outline btn-sm" href="job-details.html?id=${job.id}">View Details</a>
    </div>
  </div>`;
}

function notFoundTemplate() {
  return `
  <div class="empty-state">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <p>We couldn't find that job. It may have been removed.</p>
    <a class="btn btn-outline" href="jobs.html">Back to Jobs</a>
  </div>`;
}

function initApplyFlow(job) {
  const applyBtn = document.getElementById("applyBtn");

  const loginRequiredOverlay = document.getElementById("loginRequiredOverlay");

  const formOverlay = document.getElementById("applyFormOverlay");
  const form = document.getElementById("applyForm");
  const formClose = document.getElementById("applyFormClose");
  const formJobTitle = document.getElementById("applyFormJobTitle");
  const stepLabel = document.getElementById("applyStepLabel");
  const step1 = document.getElementById("applyStep1");
  const step2 = document.getElementById("applyStep2");
  const step1Error = document.getElementById("applyStep1Error");
  const step2Error = document.getElementById("applyStep2Error");
  const nextBtn = document.getElementById("applyNextBtn");
  const backBtn = document.getElementById("applyBackBtn");

  const successOverlay = document.getElementById("applyModalOverlay");
  const successText = document.getElementById("applyModalText");
  const successClose = document.getElementById("applyModalClose");

  const withdrawOverlay = document.getElementById("withdrawOverlay");
  const withdrawText = document.getElementById("withdrawText");
  const withdrawCancel = document.getElementById("withdrawCancel");
  const withdrawConfirm = document.getElementById("withdrawConfirm");

  let currentStep = 1;

  function setAppliedUI(applied) {
    applyBtn.classList.toggle("applied", applied);
    applyBtn.innerHTML = applied
      ? `<i class="fa-solid fa-circle-check"></i> Applied`
      : `<i class="fa-solid fa-paper-plane"></i> Apply Now`;
  }

  function showStep(step) {
    currentStep = step;
    stepLabel.textContent = step;
    step1.classList.toggle("hidden", step !== 1);
    step2.classList.toggle("hidden", step !== 2);
  }

  function openForm(user) {
    formJobTitle.textContent = `${job.title} at ${job.company}`;
    form.reset();
    step1Error.classList.add("hidden");
    step2Error.classList.add("hidden");
    showStep(1);

    // the person is already logged in, so prefill what we already know
    document.getElementById("applyName").value = user.name || "";
    document.getElementById("applyEmail").value = user.email || "";
    document.getElementById("applyPhone").value = user.phone || "";

    formOverlay.classList.add("show");
  }
  function closeForm() {
    formOverlay.classList.remove("show");
  }

  function openWithdraw() {
    withdrawText.textContent = `You already applied to "${job.title}". Do you want to withdraw your application?`;
    withdrawOverlay.classList.add("show");
  }
  function closeWithdraw() {
    withdrawOverlay.classList.remove("show");
  }

  function goToStep2() {
    const name = document.getElementById("applyName").value.trim();
    const email = document.getElementById("applyEmail").value.trim();
    const phone = document.getElementById("applyPhone").value.trim();

    if (!name || !email || !phone) {
      step1Error.textContent = "Please fill in your name, email and phone number.";
      step1Error.classList.remove("hidden");
      return;
    }
    step1Error.classList.add("hidden");
    showStep(2);
  }

  applyBtn.addEventListener("click", () => {
    const user = getUser();

    if (!user) {
      loginRequiredOverlay.classList.add("show");
      return;
    }

    if (isJobAppliedByEmail(user.email, job.id)) {
      openWithdraw();
    } else {
      openForm(user);
    }
  });

  loginRequiredOverlay.addEventListener("click", (e) => {
    if (e.target === loginRequiredOverlay) loginRequiredOverlay.classList.remove("show");
  });

  nextBtn.addEventListener("click", goToStep2);
  backBtn.addEventListener("click", () => showStep(1));

  formClose.addEventListener("click", closeForm);
  formOverlay.addEventListener("click", (e) => {
    if (e.target === formOverlay) closeForm();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Enter inside a step-1 field submits the form natively —
    // treat that the same as pressing "Next" instead of submitting.
    if (currentStep !== 2) {
      goToStep2();
      return;
    }

    const cvFile = document.getElementById("applyCv").files[0];
    if (!cvFile) {
      step2Error.textContent = "Please attach your CV (PDF) to continue.";
      step2Error.classList.remove("hidden");
      return;
    }

    const user = getUser();
    const name = document.getElementById("applyName").value.trim();
    const email = document.getElementById("applyEmail").value.trim();
    const phone = document.getElementById("applyPhone").value.trim();
    const message = document.getElementById("applyMessage").value.trim();

    saveApplication(user.email, {
      jobId: job.id,
      name,
      email,
      phone,
      cvName: cvFile.name,
      message,
    });

    closeForm();
    setAppliedUI(true);

    successText.textContent = `Thanks, ${name.split(" ")[0]}! Your application for "${job.title}" at ${job.company} has been recorded.`;
    successOverlay.classList.add("show");
  });

  successClose.addEventListener("click", () => successOverlay.classList.remove("show"));
  successOverlay.addEventListener("click", (e) => {
    if (e.target === successOverlay) successOverlay.classList.remove("show");
  });

  withdrawCancel.addEventListener("click", closeWithdraw);
  withdrawOverlay.addEventListener("click", (e) => {
    if (e.target === withdrawOverlay) closeWithdraw();
  });
  withdrawConfirm.addEventListener("click", () => {
    const user = getUser();
    withdrawApplicationByEmail(user.email, job.id);
    setAppliedUI(false);
    closeWithdraw();
  });
}

async function initJobDetails() {
  const wrap = document.getElementById("jobDetailsWrap");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let job;
  try {
    job = id ? await getJobById(id) : null;
  } catch (err) {
    console.error("Failed to load job:", err);
  }

  if (!job) {
    wrap.innerHTML = notFoundTemplate();
    return;
  }

  document.title = `${job.title} at ${job.company} | JobFinder`;
  document.getElementById("breadcrumbTitle").textContent = job.title;

  wrap.innerHTML = jobDetailsTemplate(job);

  initSaveButtons(document.querySelector(".job-header-card"));
  initApplyFlow(job);

  const relatedGrid = document.getElementById("similarJobsGrid");
  try {
    const related = await getRelatedJobs(job, 3);
    relatedGrid.innerHTML = related.length
      ? related.map(similarJobCardTemplate).join("")
      : `<p style="color:var(--ink-faint)">No similar jobs right now.</p>`;
    initSaveButtons(relatedGrid);
  } catch (err) {
    console.error("Failed to load similar jobs:", err);
    relatedGrid.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load similar jobs right now.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initBackToTop();
  initJobDetails();
});
