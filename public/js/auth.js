// =====================================
// SIGNUP
// =====================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const userData = {
            name: name,
            email: email,
            password: password
        };

        console.log("Signup Data:", userData);

        try {

            const response = await fetch("/api/signup", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            });

            const result = await response.json();

            console.log("Signup Response:", result);

            alert(result.message);

            if (response.ok) {

                signupForm.reset();

                // Go to login page
                window.location.href = "/profile.html";
            }

        } catch (error) {

            console.error("Signup error:", error);

            alert("Unable to connect to the server.");
        }

    });

}


// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const loginData = {
            email: email,
            password: password
        };

        console.log("Login Data:", loginData);

        try {

            const response = await fetch("/api/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            console.log("Login Response:", result);

            alert(result.message);

            if (response.ok) {

                console.log("Logged in user:", result.user);

                // For now, go to dashboard
                window.location.href = "/profile.html";
            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to the server.");
        }

    });

}