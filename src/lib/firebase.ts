import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCG9epju3_WOFAwHrDTBYoNbGVq7rXmJIM",
  authDomain: "reactadmin-7ab4e.firebaseapp.com",
  projectId: "reactadmin-7ab4e",
  storageBucket: "reactadmin-7ab4e.firebasestorage.app",
  messagingSenderId: "586224586992",
  appId: "1:586224586992:web:87c3da2becfd66934f7235",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();