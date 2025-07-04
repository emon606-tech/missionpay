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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const getCodeBtn = document.getElementById('getCodeBtn');
const usernameInput = document.getElementById('username');
const resultDiv = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');

let currentCode = ""; // Store current code
const COOLDOWN = 60000; // 1 minute cooldown in milliseconds

getCodeBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert('Please enter your username.');
    return;
  }

  const now = Date.now();
  const lastTime = localStorage.getItem(`mission_cooldown_${username}`);

  if (lastTime && now - lastTime < COOLDOWN) {
    const secondsLeft = Math.ceil((COOLDOWN - (now - lastTime)) / 1000);
    resultDiv.textContent = `⏳ Please wait ${secondsLeft} seconds before getting another code.`;
    copyBtn.style.display = "none";
    currentCode = "";
    return;
  }

  // Generate random 4-digit code
  const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  currentCode = code;

  // Format current date/time like "YYYY-MM-DD HH:mm:ss"
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  try {
    const codesRef = database.ref('codes');
    const newCodeRef = codesRef.push();
    await newCodeRef.set({
      username,
      code,
      createdAt: formattedDate
    });

    resultDiv.textContent = `✅ User: ${username}\n🔢 Code: ${code}\n🕒 Created At: ${formattedDate}`;
    copyBtn.style.display = "inline-block";

    // Save timestamp in localStorage to enforce cooldown
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
