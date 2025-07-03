import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDIqU1m6cSbsNZE6Biil7r9rrgzzGtkeD0",
  authDomain: "missionpay-78730.firebaseapp.com",
  databaseURL: "https://missionpay-78730-default-rtdb.firebaseio.com",
  projectId: "missionpay-78730",
  storageBucket: "missionpay-78730.firebasestorage.app",
  messagingSenderId: "687273510132",
  appId: "1:687273510132:web:ccd79a29a3023291478aa1",
  measurementId: "G-RW5K0MHG46"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const getCodeBtn = document.getElementById('getCodeBtn');
const usernameInput = document.getElementById('username');
const resultDiv = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');

let currentCode = ""; // Store only the 4-digit code

const COOLDOWN = 30000;

getCodeBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert('Please enter your username.');

  const lastTime = localStorage.getItem(`mission_cooldown_${username}`);
  const now = Date.now();

  if (lastTime && now - lastTime < COOLDOWN) {
    resultDiv.textContent = "You have another mission in progress.";
    copyBtn.style.display = "none";
    currentCode = "";
    return;
  }

  const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  currentCode = code;

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  try {
    const codesRef = ref(database, 'codes');
    const newCodeRef = push(codesRef);
    await update(newCodeRef, {
      username,
      code,
      createdAt: formattedDate
    });

    resultDiv.textContent = `User: ${username} — Code: ${code}\nCreated At: ${formattedDate}`;
    copyBtn.style.display = "inline-block";
    localStorage.setItem(`mission_cooldown_${username}`, now.toString());
  } catch (error) {
    alert('Error saving to Firebase: ' + error.message);
  }
});

copyBtn.addEventListener('click', () => {
  if (currentCode) {
    navigator.clipboard.writeText(currentCode);
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy"), 2000);
  }
});
