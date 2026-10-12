const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;

    const activityLevel =
        document.getElementById("activityLevel").value;

    const dietPreference =
        document.getElementById("dietPreference").value;


    const profileData = {
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        activity_level: activityLevel,
        diet_preference: dietPreference
    };


    console.log("Profile Data:", profileData);


    try {

        const response = await fetch("/api/profile", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profileData)
        });


        const result = await response.json();

        console.log("Profile Response:", result);

        alert(result.message);


        if (response.ok) {
            profileForm.reset();

            window.location.href = "/log-food.html";
        }

    } catch (error) {

        console.error("Profile error:", error);

        alert("Unable to connect to the server.");

    }

});