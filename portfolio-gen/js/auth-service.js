import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function logout() {
  return signOut(auth);
}

function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

function getFirebaseErrorMessage(code) {
  const map = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "auth/network-request-failed": "Network error. Please check your connection."
  };

  return map[code] || "Something went wrong. Please try again.";
}

export { signup, login, logout, observeAuth, getFirebaseErrorMessage };
