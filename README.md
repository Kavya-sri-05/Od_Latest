
# OD Application System

A web-based OD (On Duty) Application System for managing student OD requests, built with:

- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React

## Features

- User authentication (JWT-based)
- Role-based access (Admin, Faculty, Student)
- OD request submission and approval workflow
- File uploads for proofs and OD letters
- Email notifications (Nodemailer)
- Admin and user management dashboards

## Project Structure

```
Od_Latest/
├── backend/
│   ├── models/           # Mongoose schemas (User, Student, ODRequest, etc.)
│   ├── routes/           # Express route handlers
│   ├── middleware/       # Auth, error handling, etc.
│   ├── uploads/          # Uploaded files (proofs, OD letters)
│   ├── utils/            # Utility modules (email service, etc.)
│   ├── config/           # Database config
│   ├── scripts/          # Utility scripts (admin creation, etc.)
│   ├── server.js         # Main server entry point
│   └── .env              # Environment variables
└── frontend/
	 ├── src/
	 │   ├── components/   # React components
	 │   ├── contexts/     # React context providers
	 │   └── styles/       # CSS files
	 ├── public/
	 └── package.json
```

## Module-wise Overview (Backend)

### 1. Server & Entry Point
- **server.js**: Main Express server setup. Connects to MongoDB, sets up middleware, routes, and static file serving.

### 2. Database Configuration
- **config/db.js**: Handles MongoDB connection using Mongoose. Reads connection string from environment variables.

### 3. Middleware
- **middleware/auth.js**: Simple JWT authentication middleware for route protection.
- **middleware/authMiddleware.js**: Advanced authentication and role-based access control. Decodes JWT, attaches user info, and supports multiple token sources.
- **middleware/errorMiddleware.js**: Centralized error handler for Express, formats error responses.

### 4. Models (Mongoose Schemas)
- **models/User.js**: User schema with roles (student, faculty, hod, admin), password hashing, and authentication helpers.
- **models/Student.js**: Student schema with register number, department, faculty advisor, and a virtual for current year calculation.
- **models/Setting.js**: Stores key-value configuration settings (e.g., sender email, event types).
- **models/ODRequest.js**: Schema for OD requests, linking students, faculty, HOD, event details, and status.

### 5. Routes (API Endpoints)
- **routes/admin.js**: Admin-only endpoints for system settings and admin management.
- **routes/auth.js**: Authentication (login, get current user) and user registration.
- **routes/forgotPassword.js**: OTP-based password reset via email.
- **routes/odRequests.js**: CRUD and workflow for OD requests, including PDF generation and notifications.
- **routes/settings.js**: Manage system settings (sender email, event types, etc.).
- **routes/users.js**: User management (admin registration, faculty listing, user listing).

### 6. Utilities
- **utils/emailService.js**: Email sending helpers using Nodemailer. Sends notifications for OD requests and proof verification, dynamically fetches sender credentials from DB or environment.

### 7. Scripts
- **scripts/createAdmin.js**: Script to create a default admin user in the database.
- **scripts/dropRegisterNoIndex.js**: Drops the `registerNo` index from the users collection (for schema migrations).
- **scripts/updateExistingPDFPaths.js**: Updates OD request documents with correct PDF paths for generated OD letters.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB

### Backend Setup

1. Install dependencies:
	```
	cd backend
	npm install
	```

2. Configure environment variables in `.env` (see sample in repo).

3. Start the backend server:
	```
	npm run dev
	```

### Frontend Setup

1. Install dependencies:
	```
	cd frontend
	npm install
	```

2. Start the frontend development server:
	```
	npm start
	```

### Default Admin Creation

- Use the script in `backend/scripts/createAdmin.js` to create an initial admin user.

## Environment Variables

Backend `.env` example:
```
PORT=port_no
MONGO_URI=your_mongo_uri
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password_generated
```

