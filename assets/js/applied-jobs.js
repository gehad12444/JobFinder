/* ============================================
   applied-jobs.js — localStorage layer for the
   fake Apply flow. Applications are stored per
   email: { [email]: [ {jobId, name, phone, cvName, message, appliedAt} ] }
   so each account only ever sees its own applications.
   ============================================ */

const APPLICATIONS_KEY = "jobfinderApplications";

function getApplicationsStore() {
  return JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || "{}");
}

function getApplicationsForEmail(email) {
  const store = getApplicationsStore();
  return store[email] || [];
}

function isJobAppliedByEmail(email, jobId) {
  return getApplicationsForEmail(email).some((a) => a.jobId === Number(jobId));
}

function getApplicationByEmail(email, jobId) {
  return getApplicationsForEmail(email).find((a) => a.jobId === Number(jobId));
}

/** entry: { jobId, name, phone, cvName, message } */
function saveApplication(email, entry) {
  const store = getApplicationsStore();
  const list = (store[email] || []).filter((a) => a.jobId !== entry.jobId);
  list.push({ ...entry, appliedAt: new Date().toISOString() });
  store[email] = list;
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(store));
  return list;
}

function withdrawApplicationByEmail(email, jobId) {
  const store = getApplicationsStore();
  store[email] = (store[email] || []).filter((a) => a.jobId !== Number(jobId));
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(store));
  return store[email];
}
