def calculate_nutrition(age,gender,height,weight,activity_level):
     # Calculate Basal Metabolic Rate (BMR)
    if gender == "male":
        bmr = (10*weight) + (6.25*height) - (5*age) + 5
    elif gender == "female":
        bmr = (10*weight)+(6.25*height) - (5*age)-161
    else:
        # Average estimate when gender is not male/female
        male_bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        female_bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

        bmr = (male_bmr + female_bmr)/2

    #Activity multipliers

    activity_factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9
    }
    activity_factor = activity_factors.get(activity_level,1.2)

    # Estimated daily calorie requirement
    calories = bmr * activity_factor

    # Protein target: approximately 1 g per kg body weight
    protein = weight * 1.0

    # Fat target: approximately 25% of daily calories
    fat = (calories * 0.25)/9

    # Remaining calories are assigned to carbohydrates
    protein_calories = protein * 4
    fat_calories = fat * 9
    carbohydrate_calories = calories - protein_calories - fat_calories
    carbohydrates = carbohydrate_calories / 4

    # Fiber: approximately 14 g per 1000 kcal
    fiber = (calories / 1000) * 14

    # Water: approximately 35 ml per kg body weight
    water_liters = (weight * 35) / 1000

    return {
        "calories": round(calories, 2),
        "protein": round(protein, 2),
        "carbohydrates": round(carbohydrates, 2),
        "fat": round(fat, 2),
        "fiber": round(fiber, 2),
        "water": round(water_liters, 2)
    }

# Test
if __name__ == "__main__":

    result = calculate_nutrition(
        age=21,
        gender="male",
        height=175,
        weight=65,
        activity_level="moderate"
    )

    print("Nutrition Targets:")
    print(result)

