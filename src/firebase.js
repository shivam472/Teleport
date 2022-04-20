// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBCgX98F8V7va1ykFSuxRV4htUYgP135Y",
  authDomain: "teleport-f7072.firebaseapp.com",
  projectId: "teleport-f7072",
  storageBucket: "teleport-f7072.appspot.com",
  messagingSenderId: "444665542951",
  appId: "1:444665542951:web:5d992154f15ec899fe5102",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
