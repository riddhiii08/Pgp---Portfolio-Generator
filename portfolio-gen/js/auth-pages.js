import { signup, login, observeAuth, getFirebaseErrorMessage } from "./auth-service.js";

const form = document.getElementById("auth-form");
const message = document.getElementById("auth-message");
const submitBtn = document.getElementById("auth-submit");

const mode = document.body.dataset.authMode;
const targetAfterLogin = "./index.html";

function showMessage(text, type) {
  if (!message) return;
  message.textContent = text;
  message.className = `auth-message ${type}`;
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading
    ? (mode === "signup" ? "Creating account..." : "Signing in...")
    : (mode === "signup" ? "Create Account" : "Sign In");
}

function validatePassword(password) {
  if (password.length < 6) {
    return "Password should be at least 6 characters.";
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (!hasLetter || !hasNumber) {
    return "Password should contain at least one letter and one number.";
  }

  return "";
}

observeAuth((user) => {
  if (user) {
    window.location.replace(targetAfterLogin);
  }
});

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("auth-email")?.value.trim() || "";
    const password = document.getElementById("auth-password")?.value || "";
    const confirmPassword = document.getElementById("auth-confirm-password")?.value || "";

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
    showMessage("", "");

    try {
      if (mode === "signup") {
        await signup(email, password);
      } else {
        await login(email, password);
      }

      window.location.replace(targetAfterLogin);
    } catch (error) {
      showMessage(getFirebaseErrorMessage(error.code), "error");
    } finally {
      setLoading(false);
    }
  });
}
