import {
    auth,
    db
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ==========================
// Register
// ==========================

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            registerMessage.textContent =
                "Passwords do not match.";

            return;
        }

        try {

            registerMessage.textContent =
                "Creating account...";

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            await updateProfile(result.user, {
                displayName: name
            });

            await setDoc(
                doc(db, "users", result.user.uid),
                {
                    uid: result.user.uid,
                    name: name,
                    email: email,
                    createdAt: serverTimestamp()
                }
            );

            registerMessage.textContent =
                "Account created successfully!";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {

            registerMessage.textContent =
                getAuthError(error.code);
        }

    });

}


// ==========================
// Login
// ==========================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        try {

            loginMessage.textContent =
                "Signing in...";

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            loginMessage.textContent =
                "Login successful!";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 700);

        } catch (error) {

            loginMessage.textContent =
                getAuthError(error.code);
        }

    });

}


// ==========================
// Logout
// ==========================

const logoutButtons =
    document.querySelectorAll(".logout-btn");

logoutButtons.forEach(button => {

    button.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "index.html";

    });

});


// ==========================
// Authentication State
// ==========================

onAuthStateChanged(auth, (user) => {

    const loginLinks =
        document.querySelectorAll(".login-link");

    const userElements =
        document.querySelectorAll(".user-name");

    if (user) {

        loginLinks.forEach(el => {
            el.style.display = "none";
        });

        userElements.forEach(el => {

            el.textContent =
                user.displayName ||
                user.email.split("@")[0];

        });

        document.body.classList.add("logged-in");

    } else {

        loginLinks.forEach(el => {
            el.style.display = "inline-flex";
        });

        document.body.classList.remove("logged-in");
    }

});


// ==========================
// Firebase Error Messages
// ==========================

function getAuthError(code) {

    switch (code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email.";

        case "auth/weak-password":
            return "Password should be at least 6 characters.";

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/user-not-found":
            return "Account not found.";

        case "auth/wrong-password":
            return "Incorrect password.";

        default:
            return "Something went wrong. Please try again.";
    }
}