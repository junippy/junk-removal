import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
      import {
        getFirestore,
        collection,
        addDoc,
        serverTimestamp,
      } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyDMQ5p0uc1SFaKcacVh29zgCMhK34wD85E",
        authDomain: "junk-removal-aba4a.firebaseapp.com",
        projectId: "junk-removal-aba4a",
        storageBucket: "junk-removal-aba4a.firebasestorage.app",
        messagingSenderId: "865104656645",
        appId: "1:865104656645:web:d0dacc3c805cab6f495f6c",
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      window.submitForm = async function () {
        const btn = document.getElementById("submitBtn");
        const status = document.getElementById("status");

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;
        const questions = document.getElementById("questions").value.trim();

        if (
          !firstName ||
          !lastName ||
          !phone ||
          !email ||
          !description ||
          !date
        ) {
          status.innerHTML =
            '<span class="error">Please fill in all required fields.</span>';
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          status.innerHTML =
            '<span class="error">Please enter a valid email address.</span>';
          return;
        }

        btn.disabled = true;
        btn.textContent = "Submitting…";
        status.innerHTML = "";

        try {
          const token = await new Promise((resolve, reject) => {
            grecaptcha.ready(() => {
              grecaptcha
                .execute("6LexOYMsAAAAAAbowxDp-bFFiHRU0fFRhH9-gHoL", {
                  action: "submit",
                })
                .then(resolve)
                .catch(reject);
            });
          });

          const verifyRes = await fetch("/api/verify-captcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (verifyRes.status === 429) {
            status.innerHTML =
              '<span class="error">Too many submissions. Please try again later.</span>';
            btn.disabled = false;
            btn.textContent = "Submit Request";
            return;
          }

          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            status.innerHTML =
              '<span class="error">Failed spam check. Please try again.</span>';
            btn.disabled = false;
            btn.textContent = "Submit Request";
            return;
          }

          await addDoc(collection(db, "contacts"), {
            firstName,
            lastName,
            phone,
            email,
            description,
            date,
            questions,
            submittedAt: serverTimestamp(),
          });

          status.innerHTML =
            '<span class="success">Request submitted! We\'ll be in touch soon.</span>';
          [
            "firstName",
            "lastName",
            "phone",
            "email",
            "description",
            "date",
            "questions",
          ].forEach((id) => (document.getElementById(id).value = ""));
        } catch (err) {
          console.error(err);
          status.innerHTML =
            '<span class="error">Something went wrong. Please try again.</span>';
        }

        btn.disabled = false;
        btn.textContent = "Submit Request";
      };