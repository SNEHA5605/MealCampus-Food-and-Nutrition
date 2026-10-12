# MealCampus-Food-and-Nutrition
A full-stack student nutrition tracking platform to log food intake, track calories and nutrients, and manage personalized daily nutrition goals.


# MealCampus – Student Nutrition Tracker

MealCampus is a full-stack student nutrition tracking platform designed to help students monitor their daily food intake, track calories and nutrients, and manage their nutrition goals.

## Features

- **User Authentication:** Login and signup functionality.
- **Food Logging:** Record daily food intake.
- **Nutrition Tracking:** Monitor calories and nutritional intake.
- **Food History:** Review previously logged food.
- **Water Tracking:** Track daily water consumption.
- **Nutrition Analysis:** View nutrition-related information and analysis.
- **Food Suggestions:** Get food suggestions based on the application's implemented logic.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Nutrition Backend:** Python, Flask

## Project Structure

```text
MealCampus/
├── config/
├── database/
├── public/
│   ├── css/
│   ├── js/
│   └── *.html
├── python/
├── routes/
├── server.js
├── package.json
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MySQL
- Python and pip

### 1. Clone the repository

```bash
git clone https://github.com/SNEHA5605/MealCampus-Food-and-Nutrition.git
cd MealCampus-Food-and-Nutrition
```

### 2. Install Node.js dependencies

```bash
npm install
```

### 3. Configure the database

- Create a MySQL database.
- Import the SQL file from the `database/` directory.
- Configure your database connection using environment variables.
- Never commit database passwords or secret credentials.

### 4. Start the application

Check `package.json` for the available scripts, then run the appropriate command to start the Node.js server.

If the Python nutrition service is required, install its dependencies and start it according to your Python application's configuration.

## Learning Objectives

- Full-stack web application development
- REST API integration
- Relational database management with MySQL
- Nutrition data processing using Python
- Git and GitHub version control

## Future Improvements

- Personalized nutrition recommendations
- Improved nutrition dashboards and visualizations
- Enhanced meal planning
- Additional nutrition analytics

## Author

Sneha Sagade
