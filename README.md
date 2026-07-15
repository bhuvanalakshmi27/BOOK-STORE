# 📚 BookStore – MERN Stack Online Book Shopping Platform

![MERN](https://img.shields.io/badge/Stack-MERN-3FA037?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

A **full-stack MERN-based Online Book Shopping Platform** that enables **Users** to browse and purchase books, **Sellers** to manage their inventory and orders, and **Admins** to oversee the entire system through a secure role-based dashboard.

The application follows the **MVC (Model-View-Controller)** architecture on the backend and provides a modern, responsive, and scalable user experience across desktop, tablet, and mobile devices.

---

# ✨ Features

## 👤 User Module

* 🔐 User Registration & Login (JWT Authentication)
* 📚 Browse all available books
* 🔍 Search books by title or author
* 🎯 Filter books by:

  * Genre
  * Author
  * Price
  * Rating
* 🛒 Add books to Cart
* 💳 Checkout & Place Orders
* 📦 View Order History
* ⭐ Leave Ratings & Reviews
* 👤 Update Profile
* 🚪 Secure Logout

---

## 🏪 Seller Module

* 🔐 Seller Registration & Login
* 📖 Add New Books
* ✏️ Edit Existing Books
* ❌ Delete Book Listings
* 🖼 Upload Book Cover Images
* 📦 Manage Product Inventory
* 📋 View Incoming Orders
* ✅ Update Order Status
* 👤 Manage Seller Profile
* 🚪 Logout

---

## 🛡️ Admin Module

* 🔐 Secure Admin Authentication
* 👥 Manage Users
* 🏪 Approve & Manage Sellers
* 📚 Manage All Books
* 📦 Monitor All Orders
* 📊 View System Statistics
* ⚙️ Full Administrative Control
* 🚪 Logout

---

# 🚀 Tech Stack

## Frontend

* ⚛️ React.js (Vite)
* React Router DOM
* Axios
* Bootstrap
* Custom CSS

## Backend

* 🟢 Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* CORS
* dotenv

---

# 🏗️ Project Architecture

```
bookstore-mern/
│
├── client/
│   ├── src/
│   │   ├── Admin/
│   │   ├── Seller/
│   │   ├── User/
│   │   ├── Components/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── uploads/
    ├── server.js
    └── .env.example
```

---

# 🗄️ Database Design

The application is built using **MongoDB** with **Mongoose** schemas.

### Collections

* 👤 Users
* 🏪 Sellers
* 🛡️ Admins
* 📚 Books
* 📦 Orders
* ⭐ Reviews
* 📦 Inventory

---

# 🔗 Entity Relationships

* User ↔ Book *(Many-to-Many via Orders & Reviews)*
* Book ↔ Author *(Many-to-Many)*
* Book ↔ Genre *(Many-to-Many)*
* User → Orders *(One-to-Many)*
* Review → User *(Many-to-One)*
* Book → Inventory *(One-to-Many)*

---

# 🔒 Authentication & Security

* ✅ JWT Authentication
* 🔐 Password Hashing using bcryptjs
* 🛡 Protected Routes
* 🎭 Role-Based Authorization
* 🌐 Environment Variables
* 🔒 Secure API Access
* 📁 Image Upload with Multer

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

---

# 📚 Core Functionalities

* 📖 Browse Books
* 🔍 Advanced Search
* 🎯 Smart Filters
* 🛒 Shopping Cart
* 💳 Checkout System
* 📦 Order Tracking
* ⭐ Ratings & Reviews
* 🖼 Book Image Upload
* 📊 Admin Dashboard
* 📚 Seller Dashboard
* 👤 User Dashboard

---

# 🧰 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/bookstore-mern.git

cd bookstore-mern
```

---

## 2️⃣ Install Frontend

```bash
cd client

npm install
```

---

## 3️⃣ Install Backend

```bash
cd ../server

npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file inside the **server** directory.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

> **⚠️ Never commit your `.env` file. Use `.env.example` with placeholder values for sharing the project.**

---

## 5️⃣ Start Backend

```bash
cd server

npm start
```

or

```bash
npm run dev
```

---

## 6️⃣ Start Frontend

```bash
cd client

npm run dev
```

---

# 📂 Backend Technologies

* Express.js
* Node.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* dotenv
* CORS

---

# 🎨 Frontend Technologies

* React.js
* Vite
* Axios
* Bootstrap
* React Router DOM

---

# 📸 Image Upload

Book cover images are uploaded using **Multer**.

Uploaded files are stored inside:

```
server/uploads/
```

Only the image path is stored in the MongoDB database.

---

# 🛡️ API Protection

The application implements secure middleware for:

* Authentication
* Authorization
* Seller-only Routes
* Admin-only Routes
* User-only Routes

---

# 👩‍💻 Developer

**Nimmala Bhuvana Lakshmi**

🎓 B.Tech – Computer Science & Technology

💻 MERN Stack Developer

🌱 Passionate about Full-Stack Development, Web Technologies, and Building Real-World Applications.

---

# 🤝 Contributing

Contributions, feature requests, and suggestions are always welcome.

If you would like to improve this project:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

It helps support the project and encourages future development.

---

