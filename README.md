# Authentication-medibase

# 🧾 Medibase User Management App

This is a full-stack user management system built with:

- **Frontend**: ReactJS + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## ✅ Features

- Login & Register
- Role-based dashboards (`admin`, `user`)
- Admin can view, edit, delete users
- Users can update their own profile

---

## 🔧 Project Setup Instructions

### 1. Clone the Repository

git clone https://github.com/your-username/medibase-app.git
cd medibase-app

### 2. Setup the Backend

cd backend
npm install

# the backend server:
node server.js


### 3. Setup the Frontend
cd ../frontend
npm install
npm run dev


### 4. Setup MongoDB
Option A: Use MongoDB Atlas
Create a cluster

Whitelist your IP

Create DB & Collection

Copy the URI and update server.js:
mongoose.connect("your_mongodb_connection_string")

Option B: Use MongoDB Locally
Install MongoDB Community Server

Start MongoDB:
mongod

Use MongoDB Compass to create medibase database

### 5. Test API
Using Postman:

POST http://localhost:5000/api/register

POST http://localhost:5000/api/login

GET http://localhost:5000/api/users?role=admin

PUT http://localhost:5000/api/users/:id

DELETE http://localhost:5000/api/users/:id