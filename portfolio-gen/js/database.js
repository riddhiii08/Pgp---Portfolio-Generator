import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { app, auth } from "./firebase-config.js";

const db = getFirestore(app);

async function savePortfolioData(portfolioData) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const portfolioRef = doc(db, "portfolios", user.uid);

  await setDoc(portfolioRef, portfolioData, { merge: true });
}

export { savePortfolioData };
