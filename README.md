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

![image](https://user-images.githubusercontent.com/96453171/230512270-5bd32747-dc09-4a53-b8de-74f6af5a4b73.png)  
![image](https://user-images.githubusercontent.com/96453171/230512350-f5ef203e-ea15-4c67-a145-b91fdcf23c8f.png)  
![image](https://user-images.githubusercontent.com/96453171/230512379-09073282-41ad-4896-8e58-1aab24474703.png)  
![image](https://user-images.githubusercontent.com/96453171/230512444-a31bac0f-f72d-4cf2-8ab4-86ab8d83133d.png)  
![image](https://user-images.githubusercontent.com/96453171/230512520-b484486e-a182-4a54-a2d3-04fad04a6c1f.png)  
![image](https://user-images.githubusercontent.com/96453171/230512575-123a0a71-8e51-40c9-8457-a4c181f65557.png)  
![image](https://user-images.githubusercontent.com/96453171/230512615-a5ed374e-5961-4110-bcfa-672f61b89cf6.png)  
