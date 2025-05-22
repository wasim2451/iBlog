# 📝 BlogApp - A Full-Stack Blogging Platform

Welcome to **BlogApp**, a dynamic blogging platform where users can register, verify their mobile number via OTP, create and manage blogs, and view blogs written by others. Built with **Node.js**, **Express**, **MongoDB**, and **EJS**, this project includes a secure authentication system, an admin dashboard, and responsive design for both desktop and mobile users.

---

## 🚀 Features

- ✅ User Registration with OTP-based Mobile Number Verification (via PhoneEmail)
- 🔐 Secure Login using Email & Password
- 📸 Blog Creation with Optional Cover Image
- 🧾 Rich-text Blog Display with Author Info and Date
- 📂 Personalized User Dashboard
- 🛠️ Admin Panel to Manage Users and Blogs
- 🌐 Deployed on [Railway](https://iblog-dreams.up.railway.app/)

---

## ⚙️ Tech Stack

- **Frontend:** HTML, CSS, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + OTP (via PhoneEmail)
- **File Uploads:** Multer
- **Deployment:** Railway

---

## 📁 Folder Structure

BlogApp/
├── models/
├── routes/
├── views/
│ ├── Partials/
│ ├── Dashboard.ejs
│ └── ...
├── public/
│ ├── images/
│ └── styles/
├── .env
├── index.js
└── README.md


---

## 🧪 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/wasim2451/iBlog.git
   cd BlogApp
2.  ```bash
    npm install
3. Create a .env file with:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PHONEMAIL_API_KEY=your_phoneemail_key

4. Run the Server : npm start
