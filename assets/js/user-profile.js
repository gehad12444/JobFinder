/* ============================================
   user-profile.js — fake auth, all in
   localStorage, no real backend.

   USER_KEY holds who is currently logged in on
   this device: { name, email, phone }.

   USERS_DB_KEY holds every account ever created
   here, keyed by email: { [email]: { name, password, phone } }.
   This is what lets the same email log back in
   later, and what applied-jobs.js keys off of to
   keep each email's applications separate.
   ============================================ */

const USER_KEY = "jobfinderUser";
const USERS_DB_KEY = "jobfinderUsers";

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
}

function getUsersDb() {
  return JSON.parse(localStorage.getItem(USERS_DB_KEY) || "{}");
}

/**
 * Logs in if the email already has an account (checking the password),
 * or creates a new account if it doesn't.
 * Returns { ok: true } or { ok: false, error }.
 */
function registerOrLogin({ name, email, password, phone }) {
  const db = getUsersDb();
  const existing = db[email];

  if (existing) {
    if (existing.password !== password) {
      return { ok: false, error: "That password doesn't match this email." };
    }
    saveUser({ name: existing.name, email, phone: existing.phone || "" });
    return { ok: true };
  }

  db[email] = { name, password, phone: phone || "" };
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  saveUser({ name, email, phone: phone || "" });
  return { ok: true };
}
