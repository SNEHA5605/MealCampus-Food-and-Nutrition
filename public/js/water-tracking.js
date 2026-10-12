const waterGoalElement =
    document.getElementById("waterGoal");

const waterConsumedElement =
    document.getElementById("waterConsumed");

const waterRemainingElement =
    document.getElementById("waterRemaining");

const waterPercentageElement =
    document.getElementById("waterPercentage");

const waterProgressElement =
    document.getElementById("waterProgress");

const waterMessageElement =
    document.getElementById("waterMessage");


// ===============================
// LOAD TODAY'S WATER
// ===============================

async function loadWaterData() {

    try {

        const response =
            await fetch("/api/today-water");

        const result =
            await response.json();

        console.log("Water data:", result);

        if (!response.ok) {

            alert(
                result.message ||
                "Unable to load water information."
            );

            return;
        }


        // ===============================
        // API RESPONSE
        // consumed = milliliters
        // target = liters
        // ===============================

        const consumedMl =
            Number(result.consumed) || 0;

        const targetLiters =
            Number(result.target) || 0;


        // Convert target liters to milliliters

        const targetMl =
            targetLiters * 1000;


        // Convert consumed milliliters to liters

        const consumedLiters =
            consumedMl / 1000;


        // Calculate remaining water

        let remainingMl =
            targetMl - consumedMl;

        if (remainingMl < 0) {
            remainingMl = 0;
        }


        const remainingLiters =
            remainingMl / 1000;


        // Calculate percentage

        let percentage = 0;

        if (targetMl > 0) {

            percentage =
                (consumedMl / targetMl) * 100;
        }


        if (percentage > 100) {
            percentage = 100;
        }


        // ===============================
        // UPDATE UI
        // ===============================

        if (waterGoalElement) {

            waterGoalElement.textContent =
                `${targetLiters.toFixed(2)} L`;
        }


        if (waterConsumedElement) {

            waterConsumedElement.textContent =
                `${consumedLiters.toFixed(2)} L`;
        }


        if (waterRemainingElement) {

            waterRemainingElement.textContent =
                `${remainingLiters.toFixed(2)} L`;
        }


        if (waterPercentageElement) {

            waterPercentageElement.textContent =
                `${percentage.toFixed(0)}%`;
        }


        if (waterProgressElement) {

            waterProgressElement.style.width =
                `${percentage}%`;
        }


        // ===============================
        // WATER MESSAGE
        // ===============================

        if (waterMessageElement) {

            if (consumedMl >= targetMl && targetMl > 0) {

                waterMessageElement.textContent =
                    "🎉 You have reached your water goal today!";

            } else {

                waterMessageElement.textContent =
                    "Keep drinking water throughout the day. 💧";
            }
        }


        console.log(
            "Consumed:",
            consumedLiters,
            "L"
        );

        console.log(
            "Target:",
            targetLiters,
            "L"
        );

        console.log(
            "Remaining:",
            remainingLiters,
            "L"
        );

        console.log(
            "Progress:",
            percentage,
            "%"
        );

    } catch (error) {

        console.error(
            "Error loading water data:",
            error
        );

        alert(
            "Unable to load water information."
        );
    }
}


// ===============================
// ADD WATER
// ===============================

const waterButtons =
    document.querySelectorAll(".water-btn");


waterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        async () => {

            const amount =
                Number(button.dataset.amount);


            if (!amount || amount <= 0) {
                return;
            }


            try {

                const response =
                    await fetch(
                        "/api/water-log",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                amount_ml: amount
                            })
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Water save response:",
                    result
                );


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Unable to save water intake."
                    );

                    return;
                }


                // Reload today's water

                await loadWaterData();


            } catch (error) {

                console.error(
                    "Error saving water:",
                    error
                );

                alert(
                    "Unable to save water intake."
                );
            }
        }
    );

});


// ===============================
// LOAD DATA WHEN PAGE OPENS
// ===============================

loadWaterData();