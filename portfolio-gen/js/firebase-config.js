import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

export { app, auth };
