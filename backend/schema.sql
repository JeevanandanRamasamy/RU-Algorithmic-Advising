-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS RUAA;
USE RUAA;

-- Drop existing tables if they exist
-- Ensures that dependencies are dropped/added in the correct order
DROP TABLE IF EXISTS Section;
DROP TABLE IF EXISTS SchedulePlan;
DROP TABLE IF EXISTS RequirementGroup;
DROP TABLE IF EXISTS StudentProgram;
DROP TABLE IF EXISTS Program;
DROP TABLE IF EXISTS CourseRecord;
DROP TABLE IF EXISTS SPNRequest;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS StudentDetails;
DROP TABLE IF EXISTS Account;

-- ========================================
-- Account Table: Stores user login details
-- ========================================
CREATE TABLE Account (
    username VARCHAR(6) PRIMARY KEY,  -- Unique identifier for each user (NetID)
    password VARCHAR(256),  -- User password (set during registration)
    first_name VARCHAR(50),  -- First name of user
    last_name VARCHAR(50),  -- Last name of user
    role ENUM ('student', 'admin') NOT NULL DEFAULT 'student'  -- Defines role type
);

-- ==================================================
-- StudentDetails Table: Stores student-specific info
-- ==================================================
CREATE TABLE StudentDetails (
    username VARCHAR(6) PRIMARY KEY,  -- Foreign key to Account
    grad_year YEAR,  -- Expected graduation year
    enroll_year YEAR,  -- Year of enrollment
    credits_earned DECIMAL(4,1) CHECK (credits_earned >= 0),  -- Total credits earned (non-negative)
    gpa DECIMAL(3, 2) CHECK (gpa BETWEEN 0.00 AND 4.00),  -- GPA range between 0.00 and 4.00
    FOREIGN KEY (username) REFERENCES Account(username) ON DELETE CASCADE  -- Delete student details if account is deleted
);

-- ===========================================
-- Course Table: Stores course-related details
-- ===========================================
CREATE TABLE Course (
    course_id CHAR(10) PRIMARY KEY,  -- Unique course identifier (e.g., "01:198:431")
    course_name VARCHAR(255) NOT NULL,  -- Name of the course
    credits DECIMAL(3,1) NOT NULL CHECK (credits >= 0),  -- Number of credits (must be >= 0)
    requirements VARCHAR(500),  -- Prerequisites for the course (e.g., "01:198:111")
    course_link VARCHAR(255)  -- URL to the course page (dynamically fetched)
);

-- =======================================================================
-- SPNRequest Table: Stores requests for Special Permission Numbers (SPNs)
-- =======================================================================
CREATE TABLE SPNRequest (
    student_id VARCHAR(6) NOT NULL,  -- Student requesting the SPN
    course_id CHAR(10) NOT NULL,  -- Course for which SPN is requested
    section_num CHAR(2) NOT NULL,  -- Section number (e.g., "01")
    index_num CHAR(5) NOT NULL,  -- Index number for registration
    term ENUM ('fall', 'spring', 'summer', 'winter') NOT NULL,  -- Term of the course
    year YEAR NOT NULL,  -- Year of the course
    reason VARCHAR(255) NOT NULL,  -- Reason for requesting the SPN
    status ENUM ('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',  -- Status of the request
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the request
    admin_id VARCHAR(6),  -- Admin who processed the request (if applicable)
    PRIMARY KEY (student_id, course_id, section_num),
    FOREIGN KEY (student_id) REFERENCES StudentDetails (username) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Account (username) ON DELETE SET NULL  -- Admin ID can be null if not processed yet
);

-- =================================================
-- CourseRecord Table: Tracks student course history
-- =================================================
CREATE TABLE CourseRecord (
    username VARCHAR(6) NOT NULL,  -- Student who took the course
    course_id CHAR(10) NOT NULL,  -- Course identifier
    term ENUM ('fall', 'spring', 'summer', 'winter'),  -- Term of completion
    year YEAR,  -- Year of completion
    grade VARCHAR(2) CHECK (grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PA', 'NC', 'W')),  -- Grade received
    PRIMARY KEY (username, course_id),
    FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);

-- ========================================
-- Program Table: Defines academic programs
-- ========================================
CREATE TABLE Program (
    program_id VARCHAR(7) PRIMARY KEY,  -- Unique program identifier (e.g., "NB198SJ")
    program_name VARCHAR(200) NOT NULL,  -- Name of the program
    program_type ENUM ('major', 'minor', 'certificate', 'sas_core') NOT NULL,  -- Type of program
    is_credit_intensive BOOLEAN NOT NULL DEFAULT FALSE,  -- Flag for credit-intensive programs
    additional_details TEXT  -- Lists any other important information
);

-- ===============================================
-- StudentProgram Table: Maps students to programs
-- ===============================================
CREATE TABLE StudentProgram (
    username VARCHAR(6) NOT NULL,  -- Student enrolled in the program
    program_id VARCHAR(7) NOT NULL,  -- Program identifier
    PRIMARY KEY (username, program_id),
    FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES Program (program_id) ON DELETE CASCADE
);

-- =================================================================================
-- RequirementGroup Table: Stores prerequisite requirements for courses and programs
-- =================================================================================
CREATE TABLE RequirementGroup (
	group_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each requirement group
	-- Only one of program_id or course_id can be not null at once
    group_name VARCHAR(255),
	program_id VARCHAR(7), -- ID of the program that this requirement group applies to
	course_id CHAR(10), -- ID of the course that this requirement group applies to
	num_required INT DEFAULT NULL, -- Logic used to combine the courses in this group
    min_courses_required INT DEFAULT NULL, -- Minimum number of courses required from the list of courses in the group (if applicable)
    min_credits_required INT DEFAULT NULL, -- Minimum number of credits required from the list of courses in the group (if applicable)
	list JSON DEFAULT NULL, -- JSON field to store a list of courses that are part of this group
	parent_group_id INT DEFAULT NULL, -- Parent group ID that links this group to another higher-level group
	FOREIGN KEY (program_id) REFERENCES Program (program_id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE,
	FOREIGN KEY (parent_group_id) REFERENCES RequirementGroup (group_id) ON DELETE CASCADE
);

-- =======================================================
-- SchedulePlan Table: Stores schedules for specific terms
-- =======================================================
CREATE TABLE SchedulePlan (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(6) NOT NULL,
    schedule_name VARCHAR(50),  -- Custom name for the schedule
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the last update
    term ENUM ('fall', 'spring', 'summer', 'winter') NOT NULL,
    year YEAR NOT NULL,
    FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE
);

-- ================================================================
-- Section Table: Stores course sections and instructor information
-- ================================================================
CREATE TABLE Section (
    schedule_id INT NOT NULL,
    course_id CHAR(10) NOT NULL,
    index_num CHAR(5) NOT NULL,  -- Index number for registration
    PRIMARY KEY (schedule_id, course_id),
    FOREIGN KEY (schedule_id) REFERENCES SchedulePlan (schedule_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);