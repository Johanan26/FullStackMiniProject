import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjn0kaM5AIE8qv_jWFqIadRd65HwP6zxw",
  authDomain: "twitspace-24546.firebaseapp.com",
  projectId: "twitspace-24546",
  storageBucket: "twitspace-24546.firebasestorage.app",
  messagingSenderId: "697783778350",
  appId: "1:697783778350:web:82b7fa1e86aa7da75773bf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;

