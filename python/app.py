from flask import Flask, request, jsonify
from nutrition_calculator import calculate_nutrition

app = Flask(__name__)

@app.route("/",methods=["GET"])
def home():
    return "MealCampus Python API is working!"

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json

    age = int(data["age"])
    gender = data["gender"]
    height = float(data["height"])
    weight = float(data["weight"])
    activity_level = data["activity_level"]

    result = calculate_nutrition(
        age,
        gender,
        height,
        weight,
        activity_level
    )
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000,debug=True)
