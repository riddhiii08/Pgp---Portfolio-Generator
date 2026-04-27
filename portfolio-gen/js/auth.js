import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA93t1iTQq7CzeqjcexCrriJQBZx4ZFy5g",
  authDomain: "portfolio-generator-bbf92.firebaseapp.com",
  projectId: "portfolio-generator-bbf92",
  storageBucket: "portfolio-generator-bbf92.firebasestorage.app",
  messagingSenderId: "721414510923",
  appId: "1:721414510923:web:504c72221bcc4bd98b30ce"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const mode = document.body?.dataset?.authMode || "login";
const dashboardPath = "./dashboard.html";
const loginPath = "./login.html";

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("auth-email");
const passwordInput = document.getElementById("auth-password");
const confirmPasswordInput = document.getElementById("auth-confirm-password");
const message = document.getElementById("auth-message");
const submitBtn = document.getElementById("auth-submit");
const googleBtn = document.getElementById("google-signin-btn");
const passwordToggleBtns = document.querySelectorAll(".auth-toggle-password");

function showMessage(text, type = "") {
  if (!message) return;
  message.textContent = text;
  message.className = `auth-message ${type}`.trim();
}

function setLoading(loading) {
  if (submitBtn) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading
      ? (mode === "signup" ? "Creating account..." : "Signing in...")
      : (mode === "signup" ? "Create Account" : "Login");
  }

  if (googleBtn) {
    googleBtn.disabled = loading;
  }
}

const params = new URLSearchParams(window.location.search);
if (mode === "login" && params.get("signup") === "success") {
  showMessage("Account created successfully. Please log in.", "success");
}

function validatePassword(password) {
  if (password.length < 6) {
    return "Password should be at least 6 characters.";
  }

  return "";
}

function getFirebaseErrorMessage(code) {
  const map = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/missing-email": "Please enter your email address.",
    "auth/missing-password": "Please enter your password.",
    "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-login-credentials": "Incorrect email or password.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/popup-blocked": "Popup was blocked. Allow popups and try again.",
    "auth/cancelled-popup-request": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Please check your connection."
  };

  return map[code] || "Something went wrong. Please try again.";
}

async function handlePasswordAuth(event) {
  event.preventDefault();

  const email = emailInput?.value.trim() || "";
  const password = passwordInput?.value || "";
  const confirmPassword = confirmPasswordInput?.value || "";

  if (!email || !password) {
    showMessage("Email and password are required.", "error");
    return;
  }

  if (mode === "signup") {
    const passwordError = validatePassword(password);
    if (passwordError) {
      showMessage(passwordError, "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Password and confirm password must match.", "error");
      return;
    }
  }

  setLoading(true);
  showMessage("");

  try {
    if (mode === "signup") {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      window.location.replace(`${loginPath}?signup=success`);
      return;
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }

    window.location.replace(dashboardPath);
  } catch (error) {
    showMessage(getFirebaseErrorMessage(error.code), "error");
  } finally {
    setLoading(false);
  }
}

async function handleGoogleSignIn() {
  setLoading(true);
  showMessage("");

  try {
    await signInWithPopup(auth, googleProvider);
    window.location.replace(dashboardPath);
  } catch (error) {
    showMessage(getFirebaseErrorMessage(error.code), "error");
  } finally {
    setLoading(false);
  }
}

async function resetPassword(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

  return sendPasswordResetEmail(auth, email);
}

onAuthStateChanged(auth, (user) => {
  if (user && mode === "login") {
    window.location.replace(dashboardPath);
  }
});

if (form) {
  form.addEventListener("submit", handlePasswordAuth);
}

if (googleBtn) {
  googleBtn.addEventListener("click", handleGoogleSignIn);
}

passwordToggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-toggle-password");
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.classList.toggle("is-visible", isHidden);
    btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    btn.setAttribute("title", isHidden ? "Hide password" : "Show password");
  });
});

const forgotPasswordLink = document.getElementById("forgot-password-link");
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim() || window.prompt("Enter your email address to reset your password:")?.trim() || "";
    if (!email) {
      showMessage("Email is required to reset your password.", "error");
      return;
    }

    setLoading(true);
    showMessage("");

    try {
      resetPassword(email)
        .then(() => {
          alert("Reset email sent!");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      showMessage(getFirebaseErrorMessage(error.code), "error");
    } finally {
      setLoading(false);
    }
  });
}

export { resetPassword };
