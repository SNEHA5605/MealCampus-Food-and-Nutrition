const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

const db = require("./config/db");

const app = express();
const PORT = 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "mealcampus-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


// ==========================================
// TEST API
// ==========================================

app.get("/api/test", (req, res) => {

    res.json({
        message: "MealCampus API is working!"
    });

});


// ==========================================
// SIGNUP
// ==========================================

app.post("/api/signup", async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please fill all fields."
        });

    }

    try {

        // Check whether email already exists

        const checkSql = `
            SELECT id
            FROM users
            WHERE email = ?
        `;

        db.query(
            checkSql,
            [email],
            async (err, results) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        message: "Database error."
                    });

                }

                if (results.length > 0) {

                    return res.status(400).json({
                        message: "Email already registered."
                    });

                }

                // Hash password

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                const insertSql = `
                    INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        name,
                        email,
                        hashedPassword
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(err);

                            return res.status(500).json({
                                message:
                                    "Failed to create account."
                            });

                        }

                        // Save user ID in session

                        req.session.userId =
                            result.insertId;

                        res.status(201).json({

                            message:
                                "Account created successfully!",

                            redirect:
                                "/profile.html"

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message:
                "Please enter email and password."
        });

    }

    const sql = `
        SELECT
            id,
            name,
            email,
            password
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Database error."
                });

            }

            if (results.length === 0) {

                return res.status(401).json({
                    message:
                        "Invalid email or password."
                });

            }

            const user = results[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {

                return res.status(401).json({
                    message:
                        "Invalid email or password."
                });

            }

            req.session.userId =
                user.id;

            res.json({

                message:
                    "Login successful!",

                redirect:
                    "/profile.html"

            });

        }
    );

});


// ==========================================
// PROFILE
// ==========================================

app.post("/api/profile", async (req, res) => {

    const user_id =
        req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message: "User not logged in."
        });

    }

    const {
        age,
        gender,
        height,
        weight,
        activity_level,
        diet_preference
    } = req.body;

    if (
        !age ||
        !gender ||
        !height ||
        !weight ||
        !activity_level ||
        !diet_preference
    ) {

        return res.status(400).json({
            message:
                "Please fill all profile fields."
        });

    }

    try {

        // ==========================================
        // SAVE PROFILE
        // ==========================================

        const profileSql = `
            INSERT INTO student_profiles
            (
                user_id,
                age,
                gender,
                height,
                weight,
                activity_level,
                diet_preference
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            profileSql,
            [
                user_id,
                age,
                gender,
                height,
                weight,
                activity_level,
                diet_preference
            ],
            async (err) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        message:
                            "Failed to save profile."
                    });

                }

                try {

                    // ==========================================
                    // CALL PYTHON NUTRITION CALCULATOR
                    // ==========================================

                    const pythonResponse =
                        await fetch(
                            "http://127.0.0.1:5000/calculate",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    age,
                                    gender,
                                    height,
                                    weight,
                                    activity_level

                                })

                            }
                        );

                    if (!pythonResponse.ok) {

                        throw new Error(
                            "Python nutrition API failed."
                        );

                    }

                    const nutrition =
                        await pythonResponse.json();


                    // ==========================================
                    // SAVE NUTRITION TARGETS
                    // ==========================================

                    const targetSql = `
                        INSERT INTO nutrition_targets
                        (
                            user_id,
                            calories,
                            protein,
                            carbohydrates,
                            fat,
                            fiber,
                            water
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?)

                        ON DUPLICATE KEY UPDATE
                            calories = VALUES(calories),
                            protein = VALUES(protein),
                            carbohydrates = VALUES(carbohydrates),
                            fat = VALUES(fat),
                            fiber = VALUES(fiber),
                            water = VALUES(water)
                    `;

                    db.query(
                        targetSql,
                        [
                            user_id,
                            nutrition.calories,
                            nutrition.protein,
                            nutrition.carbohydrates,
                            nutrition.fat,
                            nutrition.fiber,
                            nutrition.water
                        ],
                        (err) => {

                            if (err) {

                                console.error(err);

                                return res.status(500).json({
                                    message:
                                        "Failed to save nutrition targets."
                                });

                            }

                            res.json({

                                message:
                                    "Profile and nutrition targets saved successfully!",

                                nutrition

                            });

                        }
                    );

                } catch (pythonError) {

                    console.error(pythonError);

                    return res.status(500).json({

                        message:
                            "Profile saved, but nutrition calculation failed. Make sure the Python server is running."

                    });

                }

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});


// ==========================================
// DASHBOARD
// ==========================================

app.get("/api/dashboard", (req, res) => {

    const user_id =
        req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message: "User not logged in."
        });

    }

    const sql = `
        SELECT
            calories,
            protein,
            carbohydrates,
            fat,
            fiber,
            water
        FROM nutrition_targets
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [user_id],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to load nutrition targets."
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message:
                        "Nutrition targets not found."
                });

            }

            res.json({
                nutrition: results[0]
            });

        }
    );

});


// ==========================================
// GET FOODS
// ==========================================

app.get("/api/foods", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            serving_size,
            calories,
            protein,
            carbohydrates,
            fat,
            fiber,
            diet_type,
            category
        FROM foods
        ORDER BY category, name
    `;

    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to load foods."
                });

            }

            res.json({
                foods: results
            });

        }
    );

});


// ==========================================
// SAVE FOOD LOG
// Supports multiple foods in one meal
// ==========================================

app.post("/api/food-log", async (req, res) => {

    const user_id =
        req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message:
                "User not logged in. Please login again."
        });

    }

    const {
        meal_type,
        foods
    } = req.body;

    if (!meal_type) {

        return res.status(400).json({
            message:
                "Please select a meal."
        });

    }

    if (
        !Array.isArray(foods) ||
        foods.length === 0
    ) {

        return res.status(400).json({
            message:
                "Please add at least one food."
        });

    }

    const connection =
        await db.promise();

    try {

        await connection.query(
            "START TRANSACTION"
        );

        for (const food of foods) {

            if (
                !food.food_id ||
                !food.quantity ||
                food.quantity <= 0
            ) {

                throw new Error(
                    "Invalid food data."
                );

            }

            const sql = `
                INSERT INTO food_logs
                (
                    user_id,
                    food_id,
                    meal_type,
                    quantity
                )
                VALUES (?, ?, ?, ?)
            `;

            await connection.query(
                sql,
                [
                    user_id,
                    food.food_id,
                    meal_type,
                    food.quantity
                ]
            );

        }

        await connection.query(
            "COMMIT"
        );

        res.status(201).json({

            message:
                "Meal saved successfully!",

            foods_saved:
                foods.length

        });

    } catch (error) {

        await connection.query(
            "ROLLBACK"
        );

        console.error(error);

        res.status(500).json({
            message:
                "Failed to save meal."
        });

    }

});


// ==========================================
// TODAY'S FOOD INTAKE
// ==========================================

app.get("/api/today-intake", (req, res) => {

    const user_id =
        req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message:
                "User not logged in."
        });

    }

    const sql = `
        SELECT

            COALESCE(
                SUM(f.calories * fl.quantity),
                0
            ) AS calories,

            COALESCE(
                SUM(f.protein * fl.quantity),
                0
            ) AS protein,

            COALESCE(
                SUM(f.carbohydrates * fl.quantity),
                0
            ) AS carbohydrates,

            COALESCE(
                SUM(f.fat * fl.quantity),
                0
            ) AS fat,

            COALESCE(
                SUM(f.fiber * fl.quantity),
                0
            ) AS fiber

        FROM food_logs fl

        JOIN foods f
            ON fl.food_id = f.id

        WHERE fl.user_id = ?

        AND DATE(fl.logged_at) = CURDATE()
    `;

    db.query(
        sql,
        [user_id],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to calculate today's intake."
                });

            }

            res.json({
                intake: results[0]
            });

        }
    );

});



// ==========================================
// FOOD HISTORY
// ==========================================

app.get("/api/food-history", (req, res) => {

    const user_id = req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message: "User not logged in."
        });

    }

    const sql = `
        SELECT
            fl.id,
            f.name,
            fl.meal_type,
            fl.quantity,
            f.serving_size,
            f.calories,
            f.protein,
            f.carbohydrates,
            f.fat,
            f.fiber,
            fl.logged_at

        FROM food_logs fl

        JOIN foods f
            ON fl.food_id = f.id

        WHERE fl.user_id = ?

        ORDER BY fl.logged_at DESC

        LIMIT 100
    `;

    db.query(
        sql,
        [user_id],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to load food history."
                });

            }

            res.json({
                history: results
            });

        }
    );

});



// ==========================================
// WEEKLY NUTRITION
// Last 7 days
// ==========================================

app.get("/api/weekly-nutrition", (req, res) => {

    const user_id = req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message: "User not logged in."
        });

    }

    const sql = `
        SELECT

            DATE(fl.logged_at) AS date,

            COALESCE(
                SUM(f.calories * fl.quantity),
                0
            ) AS calories,

            COALESCE(
                SUM(f.protein * fl.quantity),
                0
            ) AS protein,

            COALESCE(
                SUM(f.carbohydrates * fl.quantity),
                0
            ) AS carbohydrates,

            COALESCE(
                SUM(f.fat * fl.quantity),
                0
            ) AS fat,

            COALESCE(
                SUM(f.fiber * fl.quantity),
                0
            ) AS fiber

        FROM food_logs fl

        JOIN foods f
            ON fl.food_id = f.id

        WHERE fl.user_id = ?

        AND DATE(fl.logged_at)
            >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)

        GROUP BY DATE(fl.logged_at)

        ORDER BY date ASC
    `;


    db.query(
        sql,
        [user_id],
        (err, results) => {

            if (err) {

                console.error(
                    "Weekly nutrition error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to load weekly nutrition."
                });

            }


            // ==========================================
            // GET DAILY NUTRITION TARGETS
            // ==========================================

            const targetSql = `
                SELECT
                    calories,
                    protein,
                    carbohydrates,
                    fat,
                    fiber,
                    water
                FROM nutrition_targets
                WHERE user_id = ?
            `;


            db.query(
                targetSql,
                [user_id],
                (targetErr, targetResults) => {

                    if (targetErr) {

                        console.error(
                            "Target error:",
                            targetErr
                        );

                        return res.status(500).json({
                            message:
                                "Failed to load nutrition targets."
                        });

                    }


                    if (
                        targetResults.length === 0
                    ) {

                        return res.status(404).json({
                            message:
                                "Nutrition targets not found."
                        });

                    }


                    const target =
                        targetResults[0];


                    // ==========================================
                    // SEND RESPONSE
                    // ==========================================

                    res.json({

                        days: results,

                        target: target

                    });

                }
            );

        }
    );

});



// ==========================================
// WATER LOG
// ==========================================

app.post("/api/water-log", (req, res) => {

    const user_id =
        req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message:
                "User not logged in."
        });

    }

    const {
        amount_ml
    } = req.body;

    if (
        !amount_ml ||
        amount_ml <= 0
    ) {

        return res.status(400).json({
            message:
                "Please enter a valid water amount."
        });

    }

    const sql = `
        INSERT INTO water_logs
        (
            user_id,
            amount_ml
        )
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            amount_ml
        ],
        (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to save water intake."
                });

            }

            res.status(201).json({

                message:
                    "Water intake saved successfully!"

            });

        }
    );

});


// ==========================================
// TODAY'S WATER
// ==========================================

app.get("/api/today-water", (req, res) => {

    const user_id =
        req.session.userId;

    if (!user_id) {

        return res.status(401).json({
            message:
                "User not logged in."
        });

    }

    const sql = `
        SELECT

            COALESCE(
                (
                    SELECT SUM(amount_ml)
                    FROM water_logs
                    WHERE user_id = ?
                    AND DATE(logged_at) = CURDATE()
                ),
                0
            ) AS consumed,

            COALESCE(
                (
                    SELECT water
                    FROM nutrition_targets
                    WHERE user_id = ?
                    LIMIT 1
                ),
                0
            ) AS target
    `;

    db.query(
        sql,
        [
            user_id,
            user_id
        ],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to load water data."
                });

            }

            const data =
                results[0];

            res.json({

                consumed:
                    Number(data.consumed) || 0,

                target:
                    Number(data.target) || 0

            });

        }
    );

});


// ==========================================
// NUTRITION RECOMMENDATIONS
// IMPROVED GAP-BASED SYSTEM
// ==========================================

app.get(
    "/api/nutrition-recommendations",
    async (req, res) => {

        try {

            // ==========================================
            // 1. CHECK LOGIN
            // ==========================================

            const user_id =
                req.session.userId;

            if (!user_id) {

                return res.status(401).json({
                    message:
                        "User not logged in."
                });

            }


            // ==========================================
            // 2. GET TARGETS + DIET PREFERENCE
            // ==========================================

            const [targetRows] =
                await db.promise().query(
                    `
                    SELECT
                        nt.calories,
                        nt.protein,
                        nt.carbohydrates,
                        nt.fat,
                        nt.fiber,
                        sp.diet_preference

                    FROM nutrition_targets nt

                    JOIN student_profiles sp
                        ON nt.user_id = sp.user_id

                    WHERE nt.user_id = ?

                    ORDER BY sp.id DESC

                    LIMIT 1
                    `,
                    [user_id]
                );


            if (targetRows.length === 0) {

                return res.status(404).json({
                    message:
                        "Nutrition target or profile not found."
                });

            }


            const target =
                targetRows[0];


            // ==========================================
            // 3. GET TODAY'S INTAKE
            // ==========================================

            const [intakeRows] =
                await db.promise().query(
                    `
                    SELECT

                        COALESCE(
                            SUM(
                                f.calories *
                                fl.quantity
                            ),
                            0
                        ) AS calories,

                        COALESCE(
                            SUM(
                                f.protein *
                                fl.quantity
                            ),
                            0
                        ) AS protein,

                        COALESCE(
                            SUM(
                                f.carbohydrates *
                                fl.quantity
                            ),
                            0
                        ) AS carbohydrates,

                        COALESCE(
                            SUM(
                                f.fat *
                                fl.quantity
                            ),
                            0
                        ) AS fat,

                        COALESCE(
                            SUM(
                                f.fiber *
                                fl.quantity
                            ),
                            0
                        ) AS fiber

                    FROM food_logs fl

                    JOIN foods f
                        ON fl.food_id = f.id

                    WHERE fl.user_id = ?

                    AND DATE(fl.logged_at) =
                        CURDATE()
                    `,
                    [user_id]
                );


            const intake =
                intakeRows[0];


            // ==========================================
            // 4. CALCULATE ACTUAL GAPS
            // ==========================================

            const gaps = {

                calories: Math.max(
                    Number(target.calories) -
                    Number(intake.calories),
                    0
                ),

                protein: Math.max(
                    Number(target.protein) -
                    Number(intake.protein),
                    0
                ),

                carbohydrates: Math.max(
                    Number(target.carbohydrates) -
                    Number(intake.carbohydrates),
                    0
                ),

                fat: Math.max(
                    Number(target.fat) -
                    Number(intake.fat),
                    0
                ),

                fiber: Math.max(
                    Number(target.fiber) -
                    Number(intake.fiber),
                    0
                )

            };


            console.log(
                "Today's intake:",
                intake
            );

            console.log(
                "Nutrition targets:",
                target
            );

            console.log(
                "Nutrition gaps:",
                gaps
            );


            // ==========================================
            // 5. NORMALIZE DIET PREFERENCE
            // ==========================================

            const dietPreference =
                String(
                    target.diet_preference ||
                    "vegetarian"
                )
                .toLowerCase()
                .trim();


            let allowedDietTypes =
                ["vegan"];


            // Vegetarian

            if (
                dietPreference ===
                "vegetarian"
            ) {

                allowedDietTypes = [
                    "vegan",
                    "vegetarian"
                ];

            }


            // Eggetarian

            else if (
                dietPreference ===
                    "eggetarian" ||
                dietPreference ===
                    "egg"
            ) {

                allowedDietTypes = [
                    "vegan",
                    "vegetarian",
                    "egg"
                ];

            }


            // Non-Vegetarian

            else if (
                dietPreference ===
                    "non-vegetarian" ||
                dietPreference ===
                    "non vegetarian" ||
                dietPreference ===
                    "nonvegetarian"
            ) {

                allowedDietTypes = [
                    "vegan",
                    "vegetarian",
                    "egg",
                    "non-vegetarian"
                ];

            }


            // Vegan

            else if (
                dietPreference ===
                "vegan"
            ) {

                allowedDietTypes = [
                    "vegan"
                ];

            }


            // ==========================================
            // 6. GET FOODS
            // ==========================================

            const placeholders =
                allowedDietTypes
                    .map(() => "?")
                    .join(",");


            const [foods] =
                await db.promise().query(
                    `
                    SELECT
                        id,
                        name,
                        serving_size,
                        calories,
                        protein,
                        carbohydrates,
                        fat,
                        fiber,
                        diet_type,
                        category

                    FROM foods

                    WHERE diet_type IN
                        (${placeholders})
                    `,
                    allowedDietTypes
                );


            // ==========================================
            // 7. SCORE EVERY FOOD
            // ==========================================

            const scoredFoods =
                foods.map((food) => {

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

                    const fat =
                        Number(
                            food.fat
                        ) || 0;

                    const fiber =
                        Number(
                            food.fiber
                        ) || 0;


                    let score = 0;

                    const reasons = [];


                    // ==========================================
                    // PROTEIN GAP
                    // ==========================================

                    if (
                        gaps.protein > 0
                    ) {

                        const proteinScore =
                            Math.min(
                                protein /
                                gaps.protein,
                                1
                            ) * 40;

                        score +=
                            proteinScore;


                        if (
                            protein >= 5
                        ) {

                            reasons.push(
                                "protein"
                            );

                        }

                    }


                    // ==========================================
                    // FIBER GAP
                    // ==========================================

                    if (
                        gaps.fiber > 0
                    ) {

                        const fiberScore =
                            Math.min(
                                fiber /
                                gaps.fiber,
                                1
                            ) * 25;

                        score +=
                            fiberScore;


                        if (
                            fiber >= 2
                        ) {

                            reasons.push(
                                "fiber"
                            );

                        }

                    }


                    // ==========================================
                    // CALORIE GAP
                    // ==========================================

                    if (
                        gaps.calories > 0
                    ) {

                        const calorieScore =
                            Math.min(
                                calories /
                                gaps.calories,
                                1
                            ) * 20;

                        score +=
                            calorieScore;


                        if (
                            calories >= 80
                        ) {

                            reasons.push(
                                "calories"
                            );

                        }

                    }


                    // ==========================================
                    // CARBOHYDRATE GAP
                    // ==========================================

                    if (
                        gaps.carbohydrates > 0
                    ) {

                        const carbScore =
                            Math.min(
                                carbohydrates /
                                gaps.carbohydrates,
                                1
                            ) * 10;

                        score +=
                            carbScore;


                        if (
                            carbohydrates >= 10
                        ) {

                            reasons.push(
                                "carbohydrates"
                            );

                        }

                    }


                    // ==========================================
                    // FAT GAP
                    // ==========================================

                    if (
                        gaps.fat > 0
                    ) {

                        const fatScore =
                            Math.min(
                                fat /
                                gaps.fat,
                                1
                            ) * 5;

                        score +=
                            fatScore;


                        if (
                            fat >= 3
                        ) {

                            reasons.push(
                                "healthy fats"
                            );

                        }

                    }


                    // ==========================================
                    // REMOVE DUPLICATE REASONS
                    // ==========================================

                    const uniqueReasons =
                        [
                            ...new Set(
                                reasons
                            )
                        ];


                    return {

                        id:
                            food.id,

                        name:
                            food.name,

                        serving_size:
                            food.serving_size,

                        calories,

                        protein,

                        carbohydrates,

                        fat,

                        fiber,

                        diet_type:
                            food.diet_type,

                        category:
                            food.category,

                        score,

                        reasons:
                            uniqueReasons

                    };

                });


            // ==========================================
            // 8. SORT BY SCORE
            // ==========================================

            scoredFoods.sort(
                (a, b) =>
                    b.score -
                    a.score
            );


            // ==========================================
            // 9. SELECT TOP 8
            // ==========================================

            const recommendations =
                scoredFoods
                    .filter(
                        food =>
                            food.score > 0
                    )
                    .slice(
                        0,
                        8
                    );


            // ==========================================
            // 10. SEND RESPONSE
            // ==========================================

            res.json({

                diet_preference:
                    target.diet_preference,

                gaps: {

                    calories:
                        Number(
                            gaps.calories.toFixed(2)
                        ),

                    protein:
                        Number(
                            gaps.protein.toFixed(2)
                        ),

                    carbohydrates:
                        Number(
                            gaps.carbohydrates.toFixed(2)
                        ),

                    fat:
                        Number(
                            gaps.fat.toFixed(2)
                        ),

                    fiber:
                        Number(
                            gaps.fiber.toFixed(2)
                        )

                },

                recommendations

            });


        } catch (error) {

            console.error(
                "Nutrition recommendation error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to generate nutrition recommendations.",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

app.get("/api/logout", (req, res) => {

    req.session.destroy(
        (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to logout."
                });

            }

            res.json({

                message:
                    "Logged out successfully.",

                redirect:
                    "/login.html"

            });

        }
    );

});


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `MealCampus server running at http://localhost:${PORT}`
        );

    }
);