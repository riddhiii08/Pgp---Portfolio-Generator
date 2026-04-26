import { logout, observeAuth } from "./auth-service.js";

const loginPath = "./login.html";
window.__isAuthenticated = false;
const forcedScreen = new URLSearchParams(window.location.search).get("screen");
const protectedScreens = new Set(["form", "templates", "customize", "preview"]);

function updateAuthUi(user) {
  const status = document.getElementById("auth-status");
  const logoutBtn = document.getElementById("auth-logout-btn");
  const sidebarProfileCard = document.getElementById("sidebar-profile-card");
  const sidebarProfileName = document.getElementById("sidebar-profile-name");
  const sidebarProfileEmail = document.getElementById("sidebar-profile-email");
  const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn");
  const loginBtn = document.getElementById("nav-login-btn");
  const signupBtn = document.getElementById("nav-signup-btn");
  const getStartedBtn = document.getElementById("nav-get-started-btn");

  if (status) {
    status.textContent = user?.email || "";
  }

  if (logoutBtn) {
    logoutBtn.hidden = !user;
  }

  if (sidebarProfileCard) {
    sidebarProfileCard.hidden = !user;
  }

  if (sidebarProfileName) {
    sidebarProfileName.textContent = user?.displayName || "Portfolio User";
  }

  if (sidebarProfileEmail) {
    sidebarProfileEmail.textContent = user?.email || "";
  }

  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.hidden = !user;
  }

  if (loginBtn) {
    loginBtn.hidden = Boolean(user);
  }

  if (signupBtn) {
    signupBtn.hidden = Boolean(user);
  }

  if (getStartedBtn) {
    getStartedBtn.hidden = !user;
  }
}

observeAuth((user) => {
  window.__isAuthenticated = Boolean(user);

  if (!user && forcedScreen && protectedScreens.has(forcedScreen)) {
    window.location.replace(loginPath);
    return;
  }

  updateAuthUi(user);
});

async function handleLogout(triggeredBy) {
  const navLogoutBtn = document.getElementById("auth-logout-btn");
  const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn");

  [navLogoutBtn, sidebarLogoutBtn].forEach((btn) => {
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = "Signing out...";
  });

  try {
    await logout();
    window.location.replace(loginPath);
  } catch (error) {
    [navLogoutBtn, sidebarLogoutBtn].forEach((btn) => {
      if (!btn) return;
      btn.disabled = false;
      btn.textContent = "Logout";
    });
    if (window.App && typeof window.App.toast === "function") {
      window.App.toast("Unable to sign out. Try again.", "error");
    }
  }
}

const navLogoutBtn = document.getElementById("auth-logout-btn");
if (navLogoutBtn) {
  navLogoutBtn.addEventListener("click", handleLogout);
}

const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn");
if (sidebarLogoutBtn) {
  sidebarLogoutBtn.addEventListener("click", handleLogout);
}
