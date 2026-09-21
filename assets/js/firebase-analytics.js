import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js';

// MrJino 전용 Firebase 웹 앱
const firebaseConfig = {
  apiKey: 'AIzaSyDsW7fEiMJAHckd_wY5J4b6KpDfRS7BS_4',
  authDomain: 'mrjino-web-2026.firebaseapp.com',
  projectId: 'mrjino-web-2026',
  appId: '1:1077094353194:web:128be5b04b7d0ffa053653',
  measurementId: 'G-5FY858D76D',
};

if (await isSupported()) getAnalytics(initializeApp(firebaseConfig));
