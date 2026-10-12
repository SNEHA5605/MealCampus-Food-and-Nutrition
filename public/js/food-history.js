// ==========================================
// MEALCAMPUS - FOOD HISTORY
// ==========================================


// ==========================================
// LOAD FOOD HISTORY
// ==========================================

async function loadFoodHistory() {

    const container =
        document.getElementById("historyContainer");


    if (!container) {

        console.error(
            "historyContainer not found in HTML."
        );

        return;
    }


    try {

        console.log(
            "Loading food history..."
        );


        const response =
            await fetch(
                "/api/food-history"
            );


        console.log(
            "Food history response status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Food history result:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load food history."
            );

        }


        displayFoodHistory(
            result.history
        );


    } catch (error) {

        console.error(
            "Food history error:",
            error
        );


        container.innerHTML = `

            <div class="empty-message">

                ⚠️ Unable to load food history.

                <br><br>

                ${error.message}

            </div>

        `;

    }

}


// ==========================================
// DISPLAY FOOD HISTORY
// ==========================================

function displayFoodHistory(history) {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (!container) {

        console.error(
            "historyContainer not found."
        );

        return;
    }


    // Clear loading message

    container.innerHTML = "";


    // ==========================================
    // NO FOOD HISTORY
    // ==========================================

    if (
        !history ||
        history.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                🍽️ No food has been logged yet.

                <br><br>

                Start logging your meals
                to see your food history here.

            </div>

        `;

        return;
    }


    console.log(
        "Displaying",
        history.length,
        "food records."
    );


    // ==========================================
    // CREATE FOOD CARDS
    // ==========================================

    history.forEach((food) => {


        // ==========================================
        // CONVERT VALUES TO NUMBERS
        // ==========================================

        const quantity =
            Number(food.quantity) || 0;


        const calories =
            Number(food.calories) || 0;


        const protein =
            Number(food.protein) || 0;


        const carbohydrates =
            Number(food.carbohydrates) || 0;


        const fat =
            Number(food.fat) || 0;


        const fiber =
            Number(food.fiber) || 0;


        // ==========================================
        // CALCULATE TOTAL NUTRITION
        // ==========================================

        const totalCalories =
            calories * quantity;


        const totalProtein =
            protein * quantity;


        const totalCarbs =
            carbohydrates * quantity;


        const totalFat =
            fat * quantity;


        const totalFiber =
            fiber * quantity;


        // ==========================================
        // FORMAT DATE
        // ==========================================

        const date =
            new Date(food.logged_at);


        let formattedDate =
            "Unknown date";


        if (!isNaN(date.getTime())) {

            formattedDate =
                date.toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }


        // ==========================================
        // CREATE CARD
        // ==========================================

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "history-card";


        card.innerHTML = `

            <!-- FOOD -->

            <div class="food-info">

                <h3>
                    ${getFoodEmoji(food.name)}
                    ${food.name}
                </h3>

                <p>
                    Serving:
                    ${food.serving_size}
                </p>

                <p>
                    Quantity:
                    ${quantity}
                </p>

            </div>


            <!-- MEAL + DATE -->

            <div>

                <p class="meal-info">

                    🍴
                    ${capitalize(
                        food.meal_type
                    )}

                </p>

                <p class="date-info">

                    ${formattedDate}

                </p>

            </div>


            <!-- CALORIES -->

            <div>

                <strong>

                    🔥
                    ${totalCalories.toFixed(0)}
                    kcal

                </strong>

            </div>


            <!-- NUTRITION -->

            <div class="nutrition-info">

                <span class="nutrition-item">

                    💪
                    ${totalProtein.toFixed(1)}
                    g protein

                </span>


                <span class="nutrition-item">

                    🍚
                    ${totalCarbs.toFixed(1)}
                    g carbs

                </span>


                <span class="nutrition-item">

                    🥑
                    ${totalFat.toFixed(1)}
                    g fat

                </span>


                <span class="nutrition-item">

                    🌾
                    ${totalFiber.toFixed(1)}
                    g fiber

                </span>

            </div>

        `;


        container.appendChild(
            card
        );

    });

}


// ==========================================
// FOOD EMOJI
// ==========================================

function getFoodEmoji(foodName) {

    const name =
        String(
            foodName || ""
        ).toLowerCase();


    if (
        name.includes("apple")
    ) {
        return "🍎";
    }


    if (
        name.includes("banana")
    ) {
        return "🍌";
    }


    if (
        name.includes("egg")
    ) {
        return "🥚";
    }


    if (
        name.includes("rice")
    ) {
        return "🍚";
    }


    if (
        name.includes("roti") ||
        name.includes("chapati")
    ) {
        return "🫓";
    }


    if (
        name.includes("dal")
    ) {
        return "🥣";
    }


    if (
        name.includes("chana") ||
        name.includes("chole") ||
        name.includes("rajma")
    ) {
        return "🥣";
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
        name.includes("maggi")
    ) {
        return "🍜";
    }


    if (
        name.includes("paneer")
    ) {
        return "🧀";
    }


    if (
        name.includes("poha")
    ) {
        return "🍽️";
    }


    if (
        name.includes("upma")
    ) {
        return "🍽️";
    }


    return "🍽️";
}


// ==========================================
// CAPITALIZE MEAL TYPE
// ==========================================

function capitalize(value) {

    if (!value) {
        return "";
    }


    return (
        String(value)
            .charAt(0)
            .toUpperCase() +
        String(value)
            .slice(1)
    );

}


// ==========================================
// START
// ==========================================

console.log(
    "Food History JavaScript loaded."
);


loadFoodHistory();