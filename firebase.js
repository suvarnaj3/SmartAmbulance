// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1cOeJyk3ju6FDu9Nxhry2iTith7wXD14",
    authDomain: "smart-ambulance-65197.firebaseapp.com",
    databaseURL: "https://smart-ambulance-65197-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-ambulance-65197",
    storageBucket: "smart-ambulance-65197.firebasestorage.app",
    messagingSenderId: "942621318647",
    appId: "1:942621318647:web:3f08ded808d9214723e2f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Signup function
document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const vehicleNumber = document.getElementById("vehicleNumber").value;
    const licenseNumber = document.getElementById("licenseNumber").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save driver data to Firebase Database
            set(ref(database, "drivers/" + user.uid), {
                fullName: fullName,
                vehicleNumber: vehicleNumber,
                licenseNumber: licenseNumber,
                email: email
            });

            alert("Signup Successful!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// Login function
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login Successful!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// Function to toggle between signup and login sections
window.toggleSection = function() {
    document.getElementById("signup-section").classList.toggle("hidden");
    document.getElementById("login-section").classList.toggle("hidden");
};
