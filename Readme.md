# Online Disaster Relief Donation System - System Integration and Architecture 
Making weekly reports as quizzes, seatworks, and other activities

## Description
This website allows users to make donations easily and securely. The system includes a modern landing page, user authentication system with login and sign-up functionality, and a complete backend API for secure data management. This project will continue to be updated as we add new pages and features, as well as improvements.

## Website Name
The website has not been named yet.

# As of now, November 1, 2025

## Pages
- Landing Page (Hero Section) - landing.html
- Login and Sign-Up Page - index.html

## Features
### User Registration or Sign Up
- Fill in your full name, email, and password.
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
- Your passwords are hashed, preventing anyone who sees it.
- Protected against SQL injection attacks
- Proper validation on everything you type in

## Technologies Used 
### Frontend
- HTML5 & CSS3 for structure and styling
- JavaScript for all the interactive stuff

### Backend
- PHP for server-side logic
- MySQL for storing user data
- RESTful API so frontend and backend can talk

### Development Environment
- XAMPP (Apache + MySQL)

## Database Structure
- **Database Name:** disaster_donation_db
- **Tables:**
  - users - Stores user account information
    - user_id, full_name, email, username, password_hash
    - donor_type (individual/organization)
    - role, is_active, created_at

## API Endpoints
- `POST /backend/api/auth/register.php` - User registration
- `POST /backend/api/auth/login.php` - User authentication


## How to run the Website
1. Clone the repository
2. Open `index.html` or run `xampp` if it uses PHP

## Contributors
- Alih, Salman L. 
- Calvi, Fairudz L.
- Sampang, Ridzwan H. 
- Usman, Al-Asraff J. 
- Zambales, Maria Victoria Jean M. 

## Instructor Name
- Arip, Jhon Paul I., Instructor

