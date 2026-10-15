import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

try {
  initializeApp({ projectId: "mvp1-aafa3" });
  console.log("Initialized!");
} catch (e) {
  console.error("Error initializing:", e.message);
}
