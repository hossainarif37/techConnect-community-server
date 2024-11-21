# TechConnect Backend 

## 🚀 Project Overview
Backend service for TechConnect, a tech community platform built with Node.js and Express.js.

## 🛠️ Technologies
- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, Passport.js

## 📦 Core Features
- User Management  
- Post Creation and Management  
- Comment Management  
- Profile Management  
- **Post Filtering System by Category**: Users can filter posts by categories like Web Development, DevOps, MERN Stack, Freelancing, and more.

## 🔗 Project Links
- **Frontend Repository**: [https://github.com/hossainarif37/techConnect-community-client](https://github.com/hossainarif37/techConnect-community-client)
- **Live Demo**: [TechConnect Live Demo](https://tech-connect-community.vercel.app)

## ⚙️ Local Setup

### **Backend Installation**
1. **Clone the repository**:
    ```bash
    git clone https://github.com/hossainarif37/techConnect-community-server.git
    cd techConnect-community-server
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment**:
    Create a `.env` file with:
    ```bash
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    CLIENT_URL=http://localhost:3000
    DB_CONNECTION_URL=mongodb+srv://your_mongodb_username:your_mongodb_password@your-cluster.mongodb.net/tech-connect-community
    JWT_SECRET_KEY=your_long_and_secure_jwt_secret_key
    ```

4. **Run the server**:
    ```bash
    npm run dev
    ```

### **Prerequisites**
- Node.js (v18.18.0+)
- MongoDB Database

## 📂 Project Structure
```
├── config/
├── controllers/
├── errorHandlers/
├── middlewares/
├── models/
├── routes/
```

### **Troubleshooting**
- Verify MongoDB connection
- Check environment variables

## 📝 Notes
- Backend runs on port 5000 by default
- Requires frontend to be running simultaneously