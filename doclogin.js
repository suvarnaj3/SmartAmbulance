// Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1cOeJyk3ju6FDu9Nxhry2iTith7wXD14",
  authDomain: "smart-ambulance-65197.firebaseapp.com",
  databaseURL: "https://smart-ambulance-65197-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-ambulance-65197",
  storageBucket: "smart-ambulance-65197.appspot.com",
  messagingSenderId: "942621318647",
  appId: "1:942621318647:web:3f08ded808d9214723e2f2",
  measurementId: "G-2S00Y54DLW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Firebase Authentication
  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save login info in the Realtime Database
      set(ref(db, 'doctor-logins/' + user.uid), {
        username: username,
        loginTime: new Date().toISOString()
      });

      alert("Login successful!");
      window.location.href = 'doctor-dashboard.html'; // Redirect to dashboard
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert(error.message);
    });
});
