// ==========================================
// MEALCAMPUS - NUTRITION ANALYSIS
// ==========================================


// ==========================================
// LOAD NUTRITION ANALYSIS
// ==========================================

async function loadNutritionAnalysis() {

    try {

        // ==========================================
        // 1. GET DAILY NUTRITION TARGETS
        // ==========================================

        const targetResponse =
            await fetch("/api/dashboard");

        const targetResult =
            await targetResponse.json();

        console.log(
            "Analysis target:",
            targetResult
        );

        if (!targetResponse.ok) {

            throw new Error(
                targetResult.message ||
                "Failed to load nutrition targets."
            );

        }


        // ==========================================
        // 2. GET TODAY'S FOOD INTAKE
        // ==========================================

        const intakeResponse =
            await fetch("/api/today-intake");

        const intakeResult =
            await intakeResponse.json();

        console.log(
            "Analysis intake:",
            intakeResult
        );

        if (!intakeResponse.ok) {

            throw new Error(
                intakeResult.message ||
                "Failed to load today's intake."
            );

        }


        // ==========================================
        // 3. GET FOOD RECOMMENDATIONS
        // ==========================================

        const recommendationResponse =
            await fetch(
                "/api/nutrition-recommendations"
            );

        const recommendationResult =
            await recommendationResponse.json();

        console.log(
            "Recommendations:",
            recommendationResult
        );


        if (!recommendationResponse.ok) {

            console.error(
                "Recommendation error:",
                recommendationResult
            );

        }


        // ==========================================
        // 4. GET DATA
        // ==========================================

        const target =
            targetResult.nutrition;

        const intake =
            intakeResult.intake;


        // ==========================================
        // 5. CREATE NUTRIENT CARDS
        // ==========================================

        createNutrientCards(
            target,
            intake
        );


        // ==========================================
        // 6. CREATE SUMMARY
        // ==========================================

        createSummary(
            target,
            intake
        );


        // ==========================================
        // 7. CREATE FOOD SUGGESTIONS
        // ==========================================

        if (
            recommendationResponse.ok &&
            recommendationResult.recommendations
        ) {

            createSuggestions(
                recommendationResult.recommendations
            );

        } else {

            createSuggestions([]);

        }


    } catch (error) {

        console.error(
            "Nutrition analysis error:",
            error
        );


        const summary =
            document.getElementById(
                "summaryContent"
            );


        if (summary) {

            summary.innerHTML = `

                <div class="summary-item">

                    <span class="summary-icon">
                        ⚠️
                    </span>

                    <span>
                        Unable to load nutrition analysis.
                        Please refresh the page.
                    </span>

                </div>

            `;

        }

    }

}


// ==========================================
// NUTRIENTS
// ==========================================

const nutrients = [

    {
        key: "calories",
        name: "🔥 Calories",
        unit: "kcal"
    },

    {
        key: "protein",
        name: "💪 Protein",
        unit: "g"
    },

    {
        key: "carbohydrates",
        name: "🍚 Carbohydrates",
        unit: "g"
    },

    {
        key: "fat",
        name: "🥑 Fat",
        unit: "g"
    },

    {
        key: "fiber",
        name: "🌾 Fiber",
        unit: "g"
    }

];


// ==========================================
// CREATE NUTRIENT CARDS
// ==========================================

function createNutrientCards(
    target,
    intake
) {

    const container =
        document.getElementById(
            "nutrientCards"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    nutrients.forEach(
        (nutrient) => {

            // MySQL DECIMAL values may arrive
            // as strings, so convert them.

            const consumed =
                Number(
                    intake[nutrient.key]
                ) || 0;


            const targetValue =
                Number(
                    target[nutrient.key]
                ) || 0;


            // ==========================================
            // CALCULATE PERCENTAGE
            // ==========================================

            let percentage = 0;


            if (targetValue > 0) {

                percentage =
                    (
                        consumed /
                        targetValue
                    ) * 100;

            }


            const barPercentage =
                Math.min(
                    percentage,
                    100
                );


            // ==========================================
            // STATUS
            // ==========================================

            let status =
                "Low";

            let statusClass =
                "status-low";


            if (
                percentage >= 70 &&
                percentage <= 110
            ) {

                status =
                    "On Track";

                statusClass =
                    "status-good";

            }

            else if (
                percentage > 110
            ) {

                status =
                    "Above Target";

                statusClass =
                    "status-high";

            }


            // ==========================================
            // CREATE CARD
            // ==========================================

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "nutrient-card";


            card.innerHTML = `

                <div class="nutrient-card-header">

                    <span class="nutrient-name">

                        ${nutrient.name}

                    </span>


                    <span
                        class="nutrient-status ${statusClass}"
                    >

                        ${status}

                    </span>

                </div>


                <div class="nutrient-values">

                    <span class="consumed-value">

                        ${consumed.toFixed(1)}

                    </span>


                    <span class="target-value">

                        / ${targetValue.toFixed(1)}
                        ${nutrient.unit}

                    </span>

                </div>


                <div class="analysis-progress">

                    <div
                        class="analysis-progress-fill"
                        style="width: ${barPercentage}%"
                    ></div>

                </div>


                <span class="nutrient-percentage">

                    ${percentage.toFixed(0)}%
                    of daily target

                </span>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// CREATE TODAY'S SUMMARY
// ==========================================

function createSummary(
    target,
    intake
) {

    const container =
        document.getElementById(
            "summaryContent"
        );


    if (!container) {
        return;
    }


    const proteinPercentage =
        getPercentage(
            intake.protein,
            target.protein
        );


    const fiberPercentage =
        getPercentage(
            intake.fiber,
            target.fiber
        );


    const caloriePercentage =
        getPercentage(
            intake.calories,
            target.calories
        );


    let summaryHTML = "";


    // ==========================================
    // PROTEIN
    // ==========================================

    if (
        proteinPercentage < 70
    ) {

        summaryHTML += `

            <div class="summary-item">

                <span class="summary-icon">
                    ⚠️
                </span>

                <span>
                    Your protein intake is currently
                    below your daily target.
                </span>

            </div>

        `;

    }

    else {

        summaryHTML += `

            <div class="summary-item">

                <span class="summary-icon">
                    ✅
                </span>

                <span>
                    Your protein intake is progressing
                    toward your daily target.
                </span>

            </div>

        `;

    }


    // ==========================================
    // FIBER
    // ==========================================

    if (
        fiberPercentage < 70
    ) {

        summaryHTML += `

            <div class="summary-item">

                <span class="summary-icon">
                    🌾
                </span>

                <span>
                    Your fiber intake could be increased
                    with fruits, vegetables, sprouts
                    or pulses.
                </span>

            </div>

        `;

    }


    // ==========================================
    // CALORIES
    // ==========================================

    if (
        caloriePercentage < 70
    ) {

        summaryHTML += `

            <div class="summary-item">

                <span class="summary-icon">
                    🔥
                </span>

                <span>
                    You have consumed less than 70%
                    of your daily calorie target so far.
                </span>

            </div>

        `;

    }

    else if (
        caloriePercentage <= 110
    ) {

        summaryHTML += `

            <div class="summary-item">

                <span class="summary-icon">
                    ✅
                </span>

                <span>
                    Your calorie intake is currently
                    within your target range.
                </span>

            </div>

        `;

    }

}


// ==========================================
// CREATE FOOD SUGGESTIONS
// ==========================================

function createSuggestions(
    recommendations
) {

    const container =
        document.getElementById(
            "suggestionsList"
        );


    if (!container) {
        return;
    }


    console.log(
        "Recommendation cards:",
        recommendations
    );


    container.innerHTML = "";


    // ==========================================
    // NO RECOMMENDATIONS
    // ==========================================

    if (
        !recommendations ||
        recommendations.length === 0
    ) {

        container.innerHTML = `

            <div class="suggestion-card">

                <h3>
                    🥗 Balanced Intake
                </h3>

                <p>
                    Your current intake does not show
                    a major nutritional gap that requires
                    a specific food suggestion.
                </p>

                <span class="suggestion-reason">

                    💡 Continue including a variety
                    of nutritious foods.

                </span>

            </div>

        `;

        return;
    }


    // ==========================================
    // CREATE EACH RECOMMENDATION CARD
    // ==========================================

    recommendations.forEach(
        (food) => {

            // ==========================================
            // CONVERT VALUES TO NUMBERS
            // ==========================================

            const calories =
                Number(
                    food.calories
                ) || 0;


            const protein =
                Number(
                    food.protein
                ) || 0;


            const carbohydrates =
                Number(
                    food.carbohydrates
                ) || 0;


            const fiber =
                Number(
                    food.fiber
                ) || 0;


            // ==========================================
            // CREATE REASON
            // ==========================================

            let reasonText =
                "May help improve your daily nutrient intake.";


            if (
                food.reasons &&
                food.reasons.length > 0
            ) {

                reasonText =
                    `Useful for increasing ${food.reasons.join(
                        " and "
                    )}.`;

            }


            // ==========================================
            // CREATE CARD
            // ==========================================

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "suggestion-card";


            card.innerHTML = `

                <h3>

                    ${getFoodEmoji(food.name)}

                    ${food.name}

                </h3>


                <p>

                    Serving:

                    ${food.serving_size}

                </p>


                <p>

                    <strong>
                        ${calories.toFixed(0)}
                    </strong>

                    kcal

                    &nbsp; • &nbsp;

                    <strong>
                        ${protein.toFixed(1)}
                    </strong>

                    g protein

                </p>


                <p>

                    <strong>
                        ${carbohydrates.toFixed(1)}
                    </strong>

                    g carbs

                    &nbsp; • &nbsp;

                    <strong>
                        ${fiber.toFixed(1)}
                    </strong>

                    g fiber

                </p>


                <span class="suggestion-reason">

                    💡 ${reasonText}

                </span>


                <!-- ADD TO FOOD LOG -->

                <button
                    class="add-food-button"
                    data-food-id="${food.id}"
                >

                    + Add to Food Log

                </button>

            `;


            container.appendChild(
                card
            );

        }
    );


    // ==========================================
    // ADD TO FOOD LOG BUTTON EVENTS
    // ==========================================

    const buttons =
        document.querySelectorAll(
            ".add-food-button"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const foodId =
                        button.dataset.foodId;


                    if (!foodId) {

                        console.error(
                            "Food ID not found."
                        );

                        return;

                    }


                    console.log(
                        "Selected food ID:",
                        foodId
                    );


                    // Open Food Log page
                    // and pass selected food ID.

                    window.location.href =
                        `/log-food.html?food_id=${foodId}`;

                }
            );

        }
    );

}


// ==========================================
// FOOD EMOJI
// ==========================================

function getFoodEmoji(
    foodName
) {

    const name =
        String(
            foodName || ""
        ).toLowerCase();


    if (
        name.includes("banana")
    ) {
        return "🍌";
    }


    if (
        name.includes("apple")
    ) {
        return "🍎";
    }


    if (
        name.includes("orange") ||
        name.includes("sweet lime")
    ) {
        return "🍊";
    }


    if (
        name.includes("mango")
    ) {
        return "🥭";
    }


    if (
        name.includes("pomegranate")
    ) {
        return "❤️";
    }


    if (
        name.includes("pineapple")
    ) {
        return "🍍";
    }


    if (
        name.includes("grapes")
    ) {
        return "🍇";
    }


    if (
        name.includes("papaya")
    ) {
        return "🍈";
    }


    if (
        name.includes("watermelon")
    ) {
        return "🍉";
    }


    if (
        name.includes("pear")
    ) {
        return "🍐";
    }


    if (
        name.includes("amla")
    ) {
        return "🟢";
    }


    if (
        name.includes("egg")
    ) {
        return "🥚";
    }


    if (
        name.includes("paneer") ||
        name.includes("cheese")
    ) {
        return "🧀";
    }


    if (
        name.includes("curd") ||
        name.includes("milk") ||
        name.includes("buttermilk") ||
        name.includes("yogurt")
    ) {
        return "🥛";
    }


    if (
        name.includes("chana") ||
        name.includes("chickpea") ||
        name.includes("rajma") ||
        name.includes("dal") ||
        name.includes("gram") ||
        name.includes("lobia") ||
        name.includes("matki")
    ) {
        return "🥣";
    }


    if (
        name.includes("sprout")
    ) {
        return "🌱";
    }


    if (
        name.includes("chicken")
    ) {
        return "🍗";
    }


    if (
        name.includes("fish")
    ) {
        return "🐟";
    }


    if (
        name.includes("rice") ||
        name.includes("pulao") ||
        name.includes("biryani") ||
        name.includes("khichdi")
    ) {
        return "🍚";
    }


    if (
        name.includes("roti") ||
        name.includes("chapati") ||
        name.includes("bread") ||
        name.includes("paratha")
    ) {
        return "🥖";
    }


    if (
        name.includes("poha") ||
        name.includes("upma") ||
        name.includes("idli") ||
        name.includes("dosa") ||
        name.includes("uttapam")
    ) {
        return "🍽️";
    }


    if (
        name.includes("spinach") ||
        name.includes("broccoli") ||
        name.includes("carrot") ||
        name.includes("peas") ||
        name.includes("cabbage") ||
        name.includes("cauliflower") ||
        name.includes("bhindi") ||
        name.includes("baingan") ||
        name.includes("lauki") ||
        name.includes("tori") ||
        name.includes("karela") ||
        name.includes("pumpkin")
    ) {
        return "🥦";
    }


    if (
        name.includes("almond") ||
        name.includes("cashew") ||
        name.includes("walnut") ||
        name.includes("peanut") ||
        name.includes("seed")
    ) {
        return "🥜";
    }


    if (
        name.includes("tofu") ||
        name.includes("soy")
    ) {
        return "🌱";
    }


    if (
        name.includes("samosa") ||
        name.includes("vada pav") ||
        name.includes("pav bhaji") ||
        name.includes("maggi")
    ) {
        return "🍽️";
    }


    return "🍽️";
}


// ==========================================
// PERCENTAGE HELPER
// ==========================================

function getPercentage(
    consumed,
    target
) {

    const consumedValue =
        Number(consumed) || 0;


    const targetValue =
        Number(target) || 0;


    if (
        targetValue <= 0
    ) {

        return 0;

    }


    return (
        consumedValue /
        targetValue
    ) * 100;

}


// ==========================================
// START
// ==========================================

loadNutritionAnalysis();