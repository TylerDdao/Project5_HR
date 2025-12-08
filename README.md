# Project5 | HR Management System

# Table of Contents
- Overview
- Features
- Technology Stack
- Installation
- Running the Application
- API Endpoints
- Documentation
- Authors

# Overview

Project5 HR Management System is a full-stack web application for enterprise-level Human Resources management. The system provides functionality for managing employees, work schedules, payroll processing, time tracking, and internal communications.

Architecture:
- Frontend: React TypeScript with Material-UI
- Backend: Flask Python REST API
- Database: MongoDB
- Authentication: JWT-based with role-based access control (Manager/Employee)

# Features

- Employee Management: Add, update, delete, and view employee records
- Schedule Management: Create shifts, assign employees, track schedules
- Payroll Management: Generate payroll, calculate salaries, manage records
- Time Tracking: Clock in/out functionality with shift record tracking
- Communication: Company announcements and direct messaging between employees

# Technology Stack

## Frontend
- React 19.1.1, TypeScript 5.9.3, Vite 7.2.4
- Material-UI 7.3.4, Tailwind CSS 4.1.14
- React Router DOM 7.9.4

## Backend
- Python 3.12, Flask 3.1.2
- PyMongo 4.15.4, PyJWT 2.10.1
- Flask-CORS 6.0.1

## Database
- MongoDB

## Additional
- Docker
- Doxygen

# Running the application using Docker
- You just need to have Docker running on your local machine, no other installation required.
`docker-compose up --build`

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

# Installation

## Backend Setup
cd Project5_HR_Back_End

### Prerequisites
- Python 3.12+
- MongoDB (v6.0+)

### Create virtual environment
`python -m venv venv`
- To activate virtual environment
  - Linux: `source venv/bin/activate`
  - Windows: `venv\Scripts\activate`

### Install dependencies
`pip install -r requirements.txt`

### Create .env file with:
- MONGO_URI=[Your mongo server's connection string]
- MONGO_DB_NAME=project5_hr
- SECRET_KEY=[Your secret key here]

## Frontend Setup
cd Project5_HR_Front_End

### Prerequisites
- Node.js (v18+), npm

### Install dependencies
npm install

# API Endpoints
## Authentication
- POST /api/login - User login

## Staff Management
- GET /api/get_staffs?page={page} - Get staff list
- GET /api/get_staff?staff_id={id} - Get staff details
- POST /api/add_staff - Add staff (Manager only)
- PUT /api/update_staff - Update staff (Manager only)
- DELETE /api/delete_staff?staff_id={id} - Delete staff (Manager only)

## Shift Management
- GET /api/shift_detail?shift_id={id} - Get shift details
- GET /api/assigned_shifts?staff_id={id} - Get assigned shifts
- POST /api/create_shift - Create shift (Manager only)
- PUT /api/update_shift?shift_id={id} - Update shift (Manager only)
- DELETE /api/delete_shift?shift_id={id} - Delete shift (Manager only)

## Time Tracking
- PUT /api/clock_in - Clock in
- PUT /api/clock_out - Clock out
- GET /api/this_week_shift_records?staff_id={id} - Get weekly records

## Payroll Management
- GET /api/my_payrolls?staff_id={id} - Get employee payrolls
- GET /api/payroll_detail?payroll_id={id} - Get payroll details
- POST /api/create_payroll - Create payroll (Manager only)
- POST /api/calculate_salary - Calculate salary from records

## Communication
- POST /api/create_communication - Create announcement or mail
- GET /api/get_announcements - Get announcements
- GET /api/get_mails?staff_id={id} - Get mails

Note: Most endpoints require JWT token: Authorization: Bearer <token>

# Documentation

- Code Documentation: Doxygen-generated docs available at /docs/html/index.html
- Database Schema: Reference schema in databaseScheme.txt

To generate documentation:
doxygen Doxyfile

## Security

- JWT-based authentication
- Password hashing
- Role-based access control (Manager/Employee)
- CORS protection
- Input validation

## Authors

- **[Tyler Dao](https://github.com/TylerDdao)** 
- **[Hui-Ying Huang](https://github.com/HuiYing00)** 
- **[Harsh Shivkumar Chauhan](https://github.com/Harsh5202)** 
