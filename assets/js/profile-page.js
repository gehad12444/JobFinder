/* ============================================
   profile-page.js — entry point for
   pages/profile.html. Shows a fake login form
   the first time, then the profile view with
   Saved Jobs and Applied Jobs tabs.
   ============================================ */

function loginFormTemplate() {
  return `
  <div class="auth-card">
    <div class="auth-icon"><i class="fa-solid fa-user"></i></div>
    <h2>Welcome to JobFinder</h2>
    <p>Log in, or sign up with a new email — this is a demo account, everything stays on this device.</p>
    <form id="loginForm">
      <label>Full Name
        <input type="text" id="loginName" placeholder="Your full name" required>
      </label>
      <label>Email
        <input type="email" id="loginEmail" placeholder="you@example.com" required>
      </label>
      <label>Password
        <input type="password" id="loginPassword" placeholder="Your password" required minlength="4">
      </label>
      <p class="form-error hidden" id="loginError"></p>
      <button type="submit" class="btn btn-primary">Continue</button>
    </form>
  </div>`;
}

function profileViewTemplate(user, savedCount, appliedCount) {
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return `
  <div class="profile-header">
    <div class="profile-avatar">${initial}</div>
    <div class="profile-info">
      <h2>Hello, ${user.name} 👋</h2>
      <p>${user.email}</p>
    </div>
    <button class="btn btn-outline" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Log Out</button>
  </div>

  <div class="profile-stats">
    <div class="profile-stat">
      <i class="fa-solid fa-paper-plane"></i>
      <h3>${appliedCount}</h3>
      <p>Applied Jobs</p>
    </div>
    <div class="profile-stat">
      <i class="fa-solid fa-heart"></i>
      <h3>${savedCount}</h3>
      <p>Saved Jobs</p>
    </div>
  </div>

  <div class="profile-tabs">
    <button class="tab-btn active" data-tab="applied">Applied Jobs</button>
    <button class="tab-btn" data-tab="saved">Saved Jobs</button>
  </div>

  <div class="tab-panel" id="appliedPanel"></div>
  <div class="tab-panel hidden" id="savedPanel"></div>`;
}

function emptyPanelTemplate(icon, text, label) {
  return `
  <div class="empty-state">
    <i class="fa-solid fa-${icon}"></i>
    <p>${text}</p>
    <a class="btn btn-outline" href="jobs.html">${label}</a>
  </div>`;
}

function appliedItemTemplate(job, application) {
  return `
  <div class="profile-list-item">
    ${companyIconHTML(job)}
    <div class="info">
      <h4><a href="job-details.html?id=${job.id}">${job.title}</a></h4>
      <div class="sub">
        <span>${job.company}</span>
        <span>${job.location}</span>
        <span>Applied ${timeAgo(application.appliedAt)}</span>
      </div>
    </div>
    <div class="right">
      <a class="withdraw-link" href="#" data-id="${job.id}">Withdraw</a>
    </div>
  </div>`;
}

function savedItemTemplate(job) {
  return `
  <div class="profile-list-item">
    ${companyIconHTML(job)}
    <div class="info">
      <h4><a href="job-details.html?id=${job.id}">${job.title}</a></h4>
      <div class="sub">
        <span>${job.company}</span>
        <span>${job.location}</span>
      </div>
    </div>
    <div class="right">
      <span class="salary">${formatSalary(job.salaryMin, job.salaryMax)}</span>
    </div>
  </div>`;
}

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      document.getElementById("appliedPanel").classList.toggle("hidden", tab !== "applied");
      document.getElementById("savedPanel").classList.toggle("hidden", tab !== "saved");
    });
  });
}

async function renderAppliedPanel(email) {
  const panel = document.getElementById("appliedPanel");
  const applications = getApplicationsForEmail(email);

  if (!applications.length) {
    panel.innerHTML = emptyPanelTemplate("paper-plane", "You haven't applied to any jobs yet.", "Browse Jobs");
    return;
  }

  try {
    const allJobs = await getAllJobs();
    const items = [...applications]
      .reverse()
      .map((app) => {
        const job = allJobs.find((j) => j.id === app.jobId);
        return job ? appliedItemTemplate(job, app) : "";
      })
      .join("");

    panel.innerHTML = `<div class="profile-list">${items}</div>`;

    panel.querySelectorAll(".withdraw-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        withdrawApplicationByEmail(email, Number(link.dataset.id));
        renderProfile();
      });
    });
  } catch (err) {
    console.error("Failed to load applied jobs:", err);
    panel.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load your applications right now.</p>`;
  }
}

async function renderSavedPanel() {
  const panel = document.getElementById("savedPanel");
  const savedIds = getSavedJobIds();

  if (!savedIds.length) {
    panel.innerHTML = emptyPanelTemplate("heart", "You haven't saved any jobs yet.", "Browse Jobs");
    return;
  }

  try {
    const allJobs = await getAllJobs();
    const jobs = savedIds.map((id) => allJobs.find((j) => j.id === id)).filter(Boolean).reverse();

    panel.innerHTML = `
      <div class="profile-list">${jobs.map(savedItemTemplate).join("")}</div>
      <a class="link-arrow manage-link" href="saved.html">Manage saved jobs <i class="fa-solid fa-arrow-right"></i></a>`;
  } catch (err) {
    console.error("Failed to load saved jobs:", err);
    panel.innerHTML = `<p style="color:var(--ink-faint)">Couldn't load your saved jobs right now.</p>`;
  }
}

function initLoginForm() {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");

    const result = registerOrLogin({ name, email, password });

    if (!result.ok) {
      errorEl.textContent = result.error;
      errorEl.classList.remove("hidden");
      return;
    }

    renderProfile();
  });
}

async function renderProfile() {
  const wrap = document.getElementById("profileContent");
  const user = getUser();

  if (!user) {
    wrap.innerHTML = loginFormTemplate();
    initLoginForm();
    return;
  }

  const savedCount = getSavedJobIds().length;
  const appliedCount = getApplicationsForEmail(user.email).length;

  wrap.innerHTML = profileViewTemplate(user, savedCount, appliedCount);

  document.getElementById("logoutBtn").addEventListener("click", () => {
    clearUser();
    renderProfile();
  });

  initTabs();
  renderAppliedPanel(user.email);
  renderSavedPanel();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initBackToTop();
  renderProfile();
});
