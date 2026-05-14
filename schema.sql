-- SQL Schema for Employee Leave Management System
-- Run these queries in your Azure SQL Database

-- Create Users table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) DEFAULT 'employee' CHECK (role IN ('employee', 'manager')),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Create LeaveRequests table
CREATE TABLE LeaveRequests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    leave_type NVARCHAR(20) NOT NULL CHECK (leave_type IN ('sick', 'vacation', 'personal', 'maternity', 'paternity')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    manager_comment NVARCHAR(MAX),
    document_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT CHK_Dates CHECK (end_date >= start_date)
);

-- Create indexes for better performance
CREATE INDEX IX_LeaveRequests_UserId ON LeaveRequests(user_id);
CREATE INDEX IX_LeaveRequests_Status ON LeaveRequests(status);
CREATE INDEX IX_LeaveRequests_CreatedAt ON LeaveRequests(created_at DESC);

-- Optional: Create a trigger to update updated_at column
CREATE TRIGGER TR_LeaveRequests_Update
ON LeaveRequests
AFTER UPDATE
AS
BEGIN
    UPDATE LeaveRequests
    SET updated_at = GETDATE()
    FROM LeaveRequests lr
    INNER JOIN inserted i ON lr.id = i.id;
END;