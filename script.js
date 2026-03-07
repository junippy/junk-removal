// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMQ5p0uc1SFaKcacVh29zgCMhK34wD85E",
  authDomain: "junk-removal-aba4a.firebaseapp.com",
  projectId: "junk-removal-aba4a",
  storageBucket: "junk-removal-aba4a.firebasestorage.app",
  messagingSenderId: "865104656645",
  appId: "1:865104656645:web:d0dacc3c805cab6f495f6c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mainForm = document.getElementById("mainForm");
mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(mainForm);
  const data = Object.fromEntries(formData.entries());
  console.log(data.email);
  addData(data);
});

// ✅ ADD a document (auto-generated ID)
async function addData(data) {
  const docRef = await addDoc(collection(db, "junk-removal-db"), {
    firstname: data.fname,
    lastname: data.lname,
    email: data.email,
    phone: data.phone,
    createdAt: new Date(),
  });
  console.log("Written with ID:", docRef.id);
}
