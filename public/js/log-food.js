// ===============================
// ELEMENTS
// ===============================

const foodSearch =
    document.getElementById("foodSearch");

const foodDropdownBtn =
    document.getElementById("foodDropdownBtn");

const foodResults =
    document.getElementById("foodResults");

const foodSelect =
    document.getElementById("food");

const selectedFoodElement =
    document.getElementById("selectedFood");

const mealTypeSelect =
    document.getElementById("mealType");

const quantityInput =
    document.getElementById("quantity");

const addFoodBtn =
    document.getElementById("addFoodBtn");

const saveMealBtn =
    document.getElementById("saveMealBtn");

const addedFoodsSection =
    document.getElementById("addedFoodsSection");

const addedFoodsList =
    document.getElementById("addedFoodsList");


// ===============================
// VARIABLES
// ===============================

let foods = [];

let mealFoods = [];

let selectedFood = null;


// ===============================
// LOAD FOODS
// ===============================

async function loadFoods() {

    try {

        const response =
            await fetch("/api/foods");

        const result =
            await response.json();

        console.log(
            "Foods response:",
            result
        );


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to load foods."
            );

            return;
        }


        foods =
            result.foods || [];


        console.log(
            "Total foods loaded:",
            foods.length
        );


        // ==================================
        // CHECK FOOD ID FROM URL
        // ==================================

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const selectedFoodId =
            urlParams.get("food_id");


        if (selectedFoodId) {

            const food =
                foods.find(
                    (item) =>
                        String(item.id) ===
                        String(selectedFoodId)
                );


            if (food) {

                selectFood(food);

                console.log(
                    "Automatically selected food:",
                    food.name
                );

            }

        }

    } catch (error) {

        console.error(
            "Error loading foods:",
            error
        );


        alert(
            "Unable to load food list."
        );

    }

}


// ===============================
// SHOW FOOD RESULTS
// ===============================

function showFoodResults(searchText = "") {

    foodResults.innerHTML = "";


    const search =
        searchText
            .trim()
            .toLowerCase();


    // ==================================
    // FILTER FOODS
    // ==================================

    let matchingFoods;


    if (search === "") {

        // Show all foods

        matchingFoods =
            foods;

    } else {

        // Show matching foods

        matchingFoods =
            foods.filter(
                (food) =>
                    food.name
                        .toLowerCase()
                        .includes(search)
            );

    }


    console.log(
        "Foods displayed:",
        matchingFoods.length
    );


    // ==================================
    // NO RESULTS
    // ==================================

    if (matchingFoods.length === 0) {

        foodResults.innerHTML = `

            <div class="no-food-results">

                No food found for
                "${searchText}"

            </div>

        `;


        foodResults.style.display =
            "block";


        return;

    }


    // ==================================
    // CREATE FOOD ITEMS
    // ==================================

    matchingFoods.forEach(
        (food) => {

            const item =
                document.createElement("div");


            item.className =
                "food-result-item";


            item.innerHTML = `

                <div class="food-result-name">

                    ${food.name}

                </div>


                <div class="food-result-details">

                    ${food.serving_size}

                    •

                    ${Number(food.calories).toFixed(0)}
                    kcal

                    •

                    ${Number(food.carbohydrates).toFixed(1)}
                    g carbs

                    •

                    ${Number(food.protein).toFixed(1)}
                    g protein

                </div>

            `;


            // ==================================
            // SELECT FOOD
            // ==================================

            item.addEventListener(
                "click",
                function () {

                    selectFood(food);

                }
            );


            foodResults.appendChild(
                item
            );

        }
    );


    foodResults.style.display =
        "block";

}


// ===============================
// SEARCH INPUT
// ===============================

foodSearch.addEventListener(
    "input",
    function () {

        showFoodResults(
            foodSearch.value
        );

    }
);


// ===============================
// CLICK SEARCH BOX
// ===============================

foodSearch.addEventListener(
    "focus",
    function () {

        showFoodResults(
            foodSearch.value
        );

    }
);


// ===============================
// DROPDOWN ARROW
// ===============================

foodDropdownBtn.addEventListener(
    "click",
    function () {

        const isVisible =
            foodResults.style.display ===
            "block";


        if (isVisible) {

            foodResults.style.display =
                "none";

        } else {

            showFoodResults(
                foodSearch.value
            );

            foodSearch.focus();

        }

    }
);


// ===============================
// SELECT FOOD
// ===============================

function selectFood(food) {

    selectedFood =
        food;


    // Store food ID

    foodSelect.value =
        food.id;


    // Display selected food

    selectedFoodElement.style.display =
        "block";


    selectedFoodElement.innerHTML = `

        <strong>
            Selected:
        </strong>

        ${food.name}

        <br>

        <small>
            Serving:
            ${food.serving_size}
        </small>

    `;


    // Put selected food name
    // inside search box

    foodSearch.value =
        food.name;


    // Hide results

    foodResults.style.display =
        "none";


    foodResults.innerHTML =
        "";


    console.log(
        "Selected food:",
        food
    );

}


// ===============================
// ADD FOOD
// ===============================

addFoodBtn.addEventListener(
    "click",
    function () {

        const mealType =
            mealTypeSelect.value;


        const foodId =
            foodSelect.value;


        const quantity =
            Number(
                quantityInput.value
            );


        // ==================================
        // VALIDATE MEAL
        // ==================================

        if (!mealType) {

            alert(
                "Please select a meal."
            );

            return;

        }


        // ==================================
        // VALIDATE FOOD
        // ==================================

        if (
            !foodId ||
            !selectedFood
        ) {

            alert(
                "Please search or select a food."
            );

            return;

        }


        // ==================================
        // VALIDATE QUANTITY
        // ==================================

        if (
            !quantity ||
            quantity <= 0
        ) {

            alert(
                "Please enter a valid quantity."
            );

            return;

        }


        // ==================================
        // ADD FOOD TO MEAL
        // ==================================

        mealFoods.push({

            food_id:
                selectedFood.id,

            name:
                selectedFood.name,

            serving_size:
                selectedFood.serving_size,

            quantity:
                quantity,

            calories:
                Number(
                    selectedFood.calories
                ),

            protein:
                Number(
                    selectedFood.protein
                ),

            carbohydrates:
                Number(
                    selectedFood.carbohydrates
                ),

            fat:
                Number(
                    selectedFood.fat
                ),

            fiber:
                Number(
                    selectedFood.fiber
                )

        });


        console.log(
            "Meal foods:",
            mealFoods
        );


        // Display foods

        displayMealFoods();


        // ==================================
        // RESET FOOD SELECTION
        // ==================================

        selectedFood =
            null;


        foodSelect.value =
            "";


        foodSearch.value =
            "";


        selectedFoodElement.style.display =
            "none";


        selectedFoodElement.innerHTML =
            "";


        foodResults.innerHTML =
            "";


        foodResults.style.display =
            "none";


        quantityInput.value =
            "1";

    }
);


// ===============================
// DISPLAY ADDED FOODS
// ===============================

function displayMealFoods() {

    addedFoodsList.innerHTML =
        "";


    if (mealFoods.length === 0) {

        addedFoodsSection.style.display =
            "none";

        return;

    }


    addedFoodsSection.style.display =
        "block";


    mealFoods.forEach(
        (food, index) => {

            const foodItem =
                document.createElement("div");


            foodItem.className =
                "added-food-item";


            foodItem.innerHTML = `

                <div>

                    <strong>
                        ${food.name}
                    </strong>

                    <p>
                        Quantity:
                        ${food.quantity}
                    </p>

                    <p>
                        Calories:
                        ${(
                            food.calories *
                            food.quantity
                        ).toFixed(1)}
                        kcal
                    </p>

                </div>


                <button
                    type="button"
                    onclick="removeFood(${index})"
                >
                    Remove
                </button>

            `;


            addedFoodsList.appendChild(
                foodItem
            );

        }
    );


    updateMealSummary();

}


// ===============================
// REMOVE FOOD
// ===============================

function removeFood(index) {

    mealFoods.splice(
        index,
        1
    );


    displayMealFoods();

}


// ===============================
// UPDATE MEAL SUMMARY
// ===============================

function updateMealSummary() {

    let totalCalories =
        0;

    let totalProtein =
        0;

    let totalCarbohydrates =
        0;

    let totalFat =
        0;

    let totalFiber =
        0;


    mealFoods.forEach(
        (food) => {

            totalCalories +=
                food.calories *
                food.quantity;


            totalProtein +=
                food.protein *
                food.quantity;


            totalCarbohydrates +=
                food.carbohydrates *
                food.quantity;


            totalFat +=
                food.fat *
                food.quantity;


            totalFiber +=
                food.fiber *
                food.quantity;

        }
    );


    document.getElementById(
        "totalCalories"
    ).textContent =
        totalCalories.toFixed(1);


    document.getElementById(
        "totalProtein"
    ).textContent =
        totalProtein.toFixed(1);


    document.getElementById(
        "totalCarbohydrates"
    ).textContent =
        totalCarbohydrates.toFixed(1);


    document.getElementById(
        "totalFat"
    ).textContent =
        totalFat.toFixed(1);


    document.getElementById(
        "totalFiber"
    ).textContent =
        totalFiber.toFixed(1);

}


// ===============================
// SAVE MEAL
// ===============================

saveMealBtn.addEventListener(
    "click",
    async function () {

        // ==================================
        // VALIDATE FOODS
        // ==================================

        if (mealFoods.length === 0) {

            alert(
                "Please add at least one food."
            );

            return;

        }


        // ==================================
        // VALIDATE MEAL
        // ==================================

        const mealType =
            mealTypeSelect.value;


        if (!mealType) {

            alert(
                "Please select a meal."
            );

            return;

        }


        // ==================================
        // PREPARE DATA
        // ==================================

        const mealData = {

            meal_type:
                mealType,

            foods:
                mealFoods.map(
                    (food) => ({

                        food_id:
                            food.food_id,

                        quantity:
                            food.quantity

                    })
                )

        };


        console.log(
            "Saving meal:",
            mealData
        );


        try {

            const response =
                await fetch(
                    "/api/food-log",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                mealData
                            )

                    }
                );


            const result =
                await response.json();


            console.log(
                "Save meal response:",
                result
            );


            if (!response.ok) {

                alert(
                    result.message ||
                    "Unable to save meal."
                );

                return;

            }


            alert(
                "Meal saved successfully! 🍽️"
            );


            // ==================================
            // CLEAR CURRENT MEAL
            // ==================================

            mealFoods =
                [];


            selectedFood =
                null;


            displayMealFoods();


            foodSearch.value =
                "";


            foodSelect.value =
                "";


            selectedFoodElement.style.display =
                "none";


            selectedFoodElement.innerHTML =
                "";


            foodResults.innerHTML =
                "";


            foodResults.style.display =
                "none";


            quantityInput.value =
                "1";


            mealTypeSelect.value =
                "";


            // ==================================
            // GO TO DASHBOARD
            // ==================================

            window.location.href =
                "/dashboard.html";


        } catch (error) {

            console.error(
                "Error saving meal:",
                error
            );


            alert(
                "Unable to connect to the server."
            );

        }

    }
);


// ===============================
// CLOSE DROPDOWN WHEN CLICKING
// OUTSIDE FOOD SEARCH
// ===============================

document.addEventListener(
    "click",
    function (event) {

        const wrapper =
            document.querySelector(
                ".food-search-wrapper"
            );


        if (
            wrapper &&
            !wrapper.contains(
                event.target
            )
        ) {

            foodResults.style.display =
                "none";

        }

    }
);


// ===============================
// LOAD FOODS
// ===============================

loadFoods();