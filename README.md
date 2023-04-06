Project Final Backend Documentation
This is the documentation for the final backend project for the web application. This project was built using Node.js and Express.js to create a RESTful API that connects to a MongoDB database.

Installation
Before you can use the project, you must install the necessary dependencies and configure the database.

Dependencies
To install the dependencies, follow these steps:

Clone the repository on your local machine.
Open a terminal and navigate to the repository directory.
Run the command npm install to install all the necessary dependencies.
Database Configuration
This project uses MongoDB as the database. To configure the database, follow these steps:

Create an account on MongoDB Atlas.
Create a new cluster and follow the instructions to connect to the database.
Create a .env file in the root of the project and add the following lines of code:
makefile
Copy code
MONGODB_USER=
MONGODB_PASS=
MONGODB_DB=
Save the .env file.
Environment Variables
The following environment variables are required for this project to function properly. You should replace the example values with your own values.

makefile
Copy code
SESSION_SECRET=example
COOKIE_KEY=example
COOKIE_SECRET=example
ADMIN_EMAIL="example"
PASS_EMAIL="example"
MAIL_NODEMAILER="example@example.com"
PASS_NODEMAILER="example"
TWILIO_ACCOUNT_SID="example"
TWILIO_AUTH_TOKEN="example"
CLOUDINARY_NAME=example
CLOUDINARY_API_KEY=example
CLOUDINARY_SECRET=example
CLOUDINARY_FOLDER=example_img
Usage
Once you have installed the dependencies and configured the database, you can use the project in the following ways:

Development
To run the project in development mode, follow these steps:

Open a terminal and navigate to the repository directory.
Run the command npm run dev to start the server in development mode.
Production
To run the project in production mode, follow these steps:

Open a terminal and navigate to the repository directory.
Run the command npm start to start the server in production mode.

