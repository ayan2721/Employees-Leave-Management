# Employee Leave Management System - Backend

## Overview
Backend API for Employee Leave Management System built with Node.js, Express, and Azure services.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Azure SQL Database
- **Authentication**: JWT
- **File Storage**: Azure Blob Storage
- **Password Hashing**: bcryptjs

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
JWT_SECRET=your_jwt_secret_key_here
DB_SERVER=your_azure_sql_server.database.windows.net
DB_NAME=your_database_name
DB_USER=your_db_username
DB_PASSWORD=your_db_password
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_CONTAINER_NAME=leave-documents
PORT=5000
```

### 3. Database Setup
Run the SQL schema in your Azure SQL Database:
```sql
-- Execute the contents of schema.sql
```

### 4. Azure Blob Storage Setup
1. Create an Azure Storage Account
2. Create a Blob Container named `leave-documents`
3. Get the connection string from Azure Portal
4. Update the `.env` file with the connection string

### 5. Run the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Leave Management
- `POST /api/leave/apply` - Apply for leave (with optional document upload)
- `GET /api/leave/my` - Get user's leave requests
- `GET /api/leave/pending` - Get pending leave requests (Manager only)
- `PUT /api/leave/approve/:id` - Approve leave request (Manager only)
- `PUT /api/leave/reject/:id` - Reject leave request (Manager only)

## File Upload
- Supports PDF, JPG, PNG, DOC, DOCX files
- Maximum file size: 5MB
- Files are stored in Azure Blob Storage
- Secure file naming with UUIDs

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- File type validation
- File size limits

## Project Structure
```
server/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── azureBlob.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── leaveController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── LeaveRequest.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── leave.js
│   ├── services/
│   │   └── blobService.js
│   └── utils/
│       ├── jwt.js
│       └── errors.js
├── .env
├── .env.example
├── package.json
├── schema.sql
├── server.js
└── README.md
```