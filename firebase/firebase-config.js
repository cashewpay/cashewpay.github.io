import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDi74NNL-0DlKOx4b-8P5kGYiCJQetliZY",
  authDomain: "cashewpay-df8ba.firebaseapp.com",
  projectId: "cashewpay-df8ba",
  storageBucket: "cashewpay-df8ba.appspot.com"
};

export const TELEGRAM_BOT_USERNAME = "cashewauth_bot";

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Firebase auth persistence could not be enabled:", error);
});
