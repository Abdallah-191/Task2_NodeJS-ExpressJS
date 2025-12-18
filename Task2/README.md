# Task2_NodeJS-ExpressJS
Node.js & Express.js & MongoDB Project

The project includes implementing CRUD operations, 
a search feature with MongoDB indexing, 
and a user authentication system (login and registration).

1. MVC Structure:
Follow the MVC pattern:
Model – Defines data schemas and handles database interactions using Mongoose.
View – Renders pages using a template engine such as EJS or Pug.
Controller – Contains business logic for handling requests and responses.

2. CRUD Operations:
Implement full CRUD functionality for a chosen entity (e.g., Students, Courses, Devices, Products):
Create: Display a form and handle data submission to create a new record.
Read: Display all records and single record details.
Update: Provide an edit form and save updated data.
Delete: Allow record deletion with confirmation.
Each operation should be connected to proper views and controllers.

3. Search with MongoDB Index:
Implement a search bar on the list page.
Use MongoDB’s index on the search field (e.g., name) to enhance query performance.
Validate the index by testing with .explain("executionStats") in MongoDB.

4. Authentication (Login & Registration):
Create User Registration and Login pages.
Use bcrypt for password hashing and Express sessions for authentication state.
Restrict CRUD pages so that only authenticated users can access them.
Note: This feature is optional (bonus).

Technologies:
Node.js – JavaScript runtime.
Express.js – Web framework.
MongoDB & Mongoose – Database.
EJS – Template engine for views.
bcrypt – Password hashing.
express-session – Authentication handling
dotenv – Environment variable management
