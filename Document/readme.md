# 📚 BookStore

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application that allows users to browse and purchase books online, sellers to manage their book listings, and administrators to manage the entire platform.

---

## 🚀 Project Overview

BookStore is an online marketplace designed for book lovers, sellers, and administrators.

* 👤 **Users** can browse, search, purchase books, and track orders.
* 🏪 **Sellers** can add, update, and manage their book inventory.
* 🛡️ **Admins** can manage users, sellers, books, and orders.

The application is fully responsive and follows the **MVC (Model-View-Controller)** architecture.

---

## ✨ Features

### 👤 User

* Register & Login
* Browse all books
* Search and filter books
* Add books to cart
* Place orders
* View order history
* Rate and review books
* Update profile

### 🏪 Seller

* Register & Login
* Add new books
* Edit book details
* Delete books
* Upload book cover images
* Manage products
* View customer orders

### 🛡️ Admin

* Secure login
* Manage users
* Manage sellers
* Manage books
* View and manage all orders
* Monitor the complete system

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js (Vite)
* React Router DOM
* Axios
* Bootstrap
* CSS

### Backend

* 🟢 Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* dotenv
* CORS

---

## 🔒 Authentication

* JWT Authentication
* Password Hashing with bcryptjs
* Role-Based Authorization
* Protected Routes
* Secure APIs

---

## 📦 Main Modules

* 📚 Book Management
* 🛒 Shopping Cart
* 📦 Order Management
* ⭐ Reviews & Ratings
* 📷 Image Upload
* 👤 User Management
* 🏪 Seller Dashboard
* 🛡️ Admin Dashboard

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/bookstore-mern.git

cd bookstore-mern
```

### Install Dependencies

**Backend**

```bash
cd server
npm install
```

**Frontend**

```bash
cd client
npm install
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd server
npm run dev
```

or

```bash
node server.js
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

> Never upload your `.env` file to GitHub.

---


## 🧪 Testing

The project was manually tested for:

* User Authentication
* Role-Based Access
* CRUD Operations
* Book Management
* Order Management
* API Testing using Postman
* Responsive UI

---

## 👩‍💻 Developer

**Nimmala Bhuvana Lakshmi**

🎓 B.Tech – Computer Science & Technology

💻 MERN Stack Developer

---

## ⭐ Support

If you like this project, don't forget to **⭐ Star** the repository.

