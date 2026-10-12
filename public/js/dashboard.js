// ==========================================
// MEALCAMPUS DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        // ==========================================
        // 1. LOAD DAILY NUTRITION TARGETS
        // ==========================================

        const targetResponse =
            await fetch("/api/dashboard");

        const targetResult =
            await targetResponse.json();

        console.log("Dashboard nutrition:", targetResult);

        if (!targetResponse.ok) {
            throw new Error(
                targetResult.message ||
                "Unable to load nutrition targets."
            );
        }

        const target = targetResult.nutrition;


        // ==========================================
        // 2. LOAD TODAY'S FOOD INTAKE
        // ==========================================

        const intakeResponse =
            await fetch("/api/today-intake");

        const intakeResult =
            await intakeResponse.json();

        console.log("Today's intake:", intakeResult);

        if (!intakeResponse.ok) {
            throw new Error(
                intakeResult.message ||
                "Unable to load today's intake."
            );
        }

        const intake = intakeResult.intake;


        // ==========================================
        // 3. LOAD TODAY'S WATER
        // ==========================================

        const waterResponse =
            await fetch("/api/today-water");

        const waterResult =
            await waterResponse.json();

        console.log("Today's water:", waterResult);

        if (!waterResponse.ok) {
            throw new Error(
                waterResult.message ||
                "Unable to load water data."
            );
        }


        // ==========================================
        // 4. DISPLAY NUTRITION
        // ==========================================

        updateNutrition(
            "calories",
            intake.calories,
            target.calories
        );

        updateNutrition(
            "protein",
            intake.protein,
            target.protein
        );

        updateNutrition(
            "carbohydrates",
            intake.carbohydrates,
            target.carbohydrates
        );

        updateNutrition(
            "fat",
            intake.fat,
            target.fat
        );

        updateNutrition(
            "fiber",
            intake.fiber,
            target.fiber
        );


        // ==========================================
        // 5. DISPLAY WATER
        // ==========================================

        updateWater(
            waterResult.consumed,
            waterResult.target
        );


        console.log("Dashboard loaded successfully.");

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        alert(
            "Unable to load dashboard. " +
            error.message
        );
    }
}


// ==========================================
// UPDATE NUTRITION CARD
// ==========================================

function updateNutrition(
    nutrient,
    consumed,
    target
) {

    consumed =
        Number(consumed) || 0;

    target =
        Number(target) || 0;


    // ------------------------------------------
    // Find elements
    // ------------------------------------------

    const consumedElement =
        document.getElementById(
            nutrient + "Consumed"
        );

    const targetElement =
        document.getElementById(
            nutrient + "Target"
        );

    const progressElement =
        document.getElementById(
            nutrient + "Progress"
        );


    // ------------------------------------------
    // Display values
    // ------------------------------------------

    if (consumedElement) {

        consumedElement.textContent =
            consumed.toFixed(1);
    }


    if (targetElement) {

        targetElement.textContent =
            target.toFixed(1);
    }


    // ------------------------------------------
    // Progress bar
    // ------------------------------------------

    if (progressElement) {

        let percentage = 0;

        if (target > 0) {

            percentage =
                (consumed / target) * 100;
        }

        percentage =
            Math.min(percentage, 100);

        progressElement.style.width =
            percentage + "%";
    }
}


// ==========================================
// UPDATE WATER
// ==========================================

function updateWater(
    consumed,
    target
) {

    consumed =
        Number(consumed) || 0;

    target =
        Number(target) || 0;


    /*
        Water target from Python is in litres.

        Water logs are stored in millilitres.

        Example:

        1500 ml = 1.50 L
        2.27 L target
    */

    const consumedLitres =
        consumed / 1000;


    // ------------------------------------------
    // Water consumed
    // ------------------------------------------

    const waterConsumed =
        document.getElementById(
            "waterConsumed"
        );

    if (waterConsumed) {

        waterConsumed.textContent =
            consumedLitres.toFixed(2);
    }


    // ------------------------------------------
    // Water target
    // ------------------------------------------

    const waterTarget =
        document.getElementById(
            "waterTarget"
        );

    if (waterTarget) {

        waterTarget.textContent =
            target.toFixed(2);
    }


    // ------------------------------------------
    // Water progress
    // ------------------------------------------

    const waterProgress =
        document.getElementById(
            "waterProgress"
        );

    if (waterProgress) {

        let percentage = 0;

        if (target > 0) {

            percentage =
                (consumedLitres / target) * 100;
        }

        percentage =
            Math.min(percentage, 100);

        waterProgress.style.width =
            percentage + "%";
    }


    // ------------------------------------------
    // Remaining water
    // ------------------------------------------

    const waterRemaining =
        document.getElementById(
            "waterRemaining"
        );

    if (waterRemaining) {

        const remaining =
            Math.max(
                target - consumedLitres,
                0
            );

        waterRemaining.textContent =
            remaining.toFixed(2);
    }
}


// ==========================================
// LOAD DASHBOARD
// ==========================================

loadDashboard();