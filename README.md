# Product Management System (Beginner Project)

## Technology
- React + Bootstrap
- Node.js + Express
- MySQL + Sequelize
- JWT authentication

## 1. Requirements
Install Node.js and XAMPP (or another local MySQL server).

## 2. Create the database
Start MySQL in XAMPP, open phpMyAdmin, and run:
```sql
CREATE DATABASE product_management;
```

## 3. Configure backend
Open `backend/.env` and update DB_PASSWORD if your MySQL root user has a password.
Change JWT_SECRET to a long random secret.

In a terminal:
```bash
cd backend
npm install
npm run seed:admin
npm run dev
```
The backend runs at http://localhost:5000.

The seed command creates the initial admin:
- Email: admin@example.com
- Password: Admin123!
Change the password after your first login. This is a local-development starter account only.

## 4. Start frontend
Open a second terminal:
```bash
cd frontend
npm install
npm start
```
React runs at http://localhost:3000.

## Features
- Admin: manage products, staff, orders, customers, reports
- Staff: view products, view customers, manage order status
- Customer: browse products, book products, view own orders, cancel pending orders
- Passwords are hashed with bcrypt
- APIs enforce role permissions on the backend

## Notes
This is a learning starter project, not production-ready. Before deploying, add stronger validation, rate limiting, secure cookie/token handling, audit logs, database migrations, and a proper password-reset process.
