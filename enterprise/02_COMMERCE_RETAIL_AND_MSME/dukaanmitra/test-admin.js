const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

try {
  initializeApp({ projectId: "mvp1-aafa3" });
  console.log("Initialized!");
} catch (e) {
  console.error("Error initializing:", e.message);
}
