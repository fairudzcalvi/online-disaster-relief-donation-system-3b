
# Online Disaster Relief Donation System - System Integration and Architecture

Weekly reports include quizzes, seatworks, and other activities

## Description

**BayanihanRelief** is a web-based system that allows users to make donations easily and securely. It features a modern landing page, a user authentication system with login and sign-up functionality, and a complete backend API for secure data management. The system will be continuously updated with new pages, features, and improvements.



## Website Name

**BayanihanRelief**


## As of November 8, 2025

### Pages

* Landing Page (Hero Section) - `landing.html`
* Login and Sign-Up Page - `index.html`
* Admin Dashboard - `admin.html`

### Features

### User Registration or Sign Up
- Fill in your full name, email, and password
- Will not let duplicate emails slip through
- You can sign up as an individual or organization

### Login System  
- Login with your email or username
- Passwords are properly encrypted (bcrypt)
- **Remember me** option for convenience
- Will indicate log in successfully when logged in.

### Simplified yet Responsive Design
- Smooth animations that do not feel clunky
- Modern design that's easy on the eyes

### Security Features
- Your passwords are hashed, preventing anyone who sees it
- Protected against SQL injection attacks
- Proper validation on everything you type in

### Admin Dashboard - UI Only

* Monitor donations, donors, distributions, and in-kind items
* Quick actions for transparency reports, distribution logging, donor updates, and adding organizations
* Modern, responsive design with smooth animations
* Statistics display:

  * Total monetary donations
  * In-kind donations
  * Active donors
  * Distributions made
* Tables for recent donations and distribution progress



## Technologies Used

### Frontend

* HTML & CSS for structure and styling.
* JavaScript for interactive features.

### Backend

* PHP for server-side logic.
* MySQL for database storage.
* RESTful API for frontend-backend communication.

### Development Environment

* XAMPP (Apache + MySQL)



## Database Structure

**Database Name:** `disaster_donation_db`

**Tables:**

* **users** - Stores user account information

  * `user_id`, `full_name`, `email`, `username`, `password_hash`
  * `donor_type` (individual/organization), `role`, `is_active`, `created_at`



## API Endpoints

* **POST /backend/api/auth/register.php** - User registration
* **POST /backend/api/auth/login.php** - User authentication



## How to Run the Website

### 1. Clone or download the repository

* Place the folder into `htdocs` (e.g., `C:\xampp\htdocs\online-disaster-relief-donation-system-3b\`)

### 2. Start XAMPP

* Open XAMPP Control Panel
* Start **Apache** and **MySQL** modules.

### 3. Create the database

* Open PhpMyAdmin
* Create database `disaster_donation_db`
* Import the SQL schema `disaster_donation_db.sql` or run the provided queries.

### 4. Configure the database connection

* Check `backend/config/database.php` for the database connection settings:

  * Host: `localhost`
  * Database: `disaster_donation_db`
  * Username: `root`
  * Password: (empty)

### 5. Access the website

* Landing Page: `http://localhost/online-disaster-relief-donation-system-3b/landing.html`
* Login/Signup Page: `http://localhost/online-disaster-relief-donation-system-3b/index.html`
* Admin Dashboard: `http://localhost/online-disaster-relief-donation-system-3b/admin.html`



## Contributors

* Alih, Salman L.
* Calvi, Fairudz L.
* Sampang, Ridzwan H.
* Usman, Al-Asraff J.
* Zambales, Maria Victoria Jean M.



## Instructor

* Arip, Jhon Paul I.


