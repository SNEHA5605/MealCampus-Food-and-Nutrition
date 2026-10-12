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



## How to Run Locally

### Prerequisites

Install the following before running the project:

- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- MySQL
- Python 3 (for the nutrition service)

### 1. Clone the Repository

```bash
git clone https://github.com/SNEHA5605/MealCampus-Food-and-Nutrition.git
cd MealCampus-Food-and-Nutrition
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory. Configure the following variables with your local MySQL settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mealcampus
```

Replace `your_mysql_password` with your local MySQL password. Never upload your `.env` file or database credentials to GitHub.

### 4. Set Up the Database

- Start your MySQL server.
- Create the `mealcampus` database if it does not already exist.
- Import the SQL script from `database/messmate.sql`.
- Ensure the database configuration matches your `.env` values.

### 5. Start the Application

Check `package.json` for the available start script, then run:

```bash
npm start
```

If the Python nutrition service is required, install its dependencies and start it according to the application's configuration.

### 6. Open the Application

Open the local URL shown in your terminal. For example, if the server runs on port 3000:

`http://localhost:3000`

The exact port and startup commands depend on the project configuration.



### 5. Start the Node.js Server

Open a terminal in the project root directory:

```bash
npm start
```

### 6. Start the Python Nutrition Service

Open a **second terminal** in the project root directory:

```bash
cd python
python app.py
```

If your system uses the Python launcher on Windows, you can try:

```bash
py app.py
```

Install the Python dependencies required by the application before starting the service.

### 7. Open the Application

Open the local URL displayed by the Node.js server in your browser.

If the Python service runs separately, ensure it is running as well and that the Node.js application is configured to communicate with it.
