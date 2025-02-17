-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS RUAA;
USE RUAA;

-- Drop existing tables if they exist
-- Ensures that dependencies are dropped/added in the correct order
DROP TABLE IF EXISTS Section;
DROP TABLE IF EXISTS SchedulePlan;
DROP TABLE IF EXISTS PlannedCourse;
DROP TABLE IF EXISTS DegreePlan;
DROP TABLE IF EXISTS Requirement;
DROP TABLE IF EXISTS RequirementGroup;
DROP TABLE IF EXISTS StudentProgram;
DROP TABLE IF EXISTS Program;
DROP TABLE IF EXISTS CourseTaken;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS StudentDetails;
DROP TABLE IF EXISTS Account;

-- ========================================
-- Account Table: Stores user login details
-- ========================================
CREATE TABLE Account (
    username VARCHAR(6) PRIMARY KEY,  -- Unique identifier for each user (NetID)
    password VARCHAR(30),  -- User password (set during registration)
    first_name VARCHAR(50),  -- First name of user
    last_name VARCHAR(50),  -- Last name of user
    role ENUM ('Student', 'Admin') NOT NULL DEFAULT 'Student'  -- Defines role type
);

-- ==================================================
-- StudentDetails Table: Stores student-specific info
-- ==================================================
CREATE TABLE StudentDetails (
    username VARCHAR(6) PRIMARY KEY,  -- Foreign key to Account
    grad_date YEAR,  -- Expected graduation year
    enroll_date YEAR,  -- Year of enrollment
    credits_earned INT CHECK (credits_earned >= 0),  -- Total credits earned (non-negative)
    gpa DECIMAL(3, 2) CHECK (gpa BETWEEN 0.00 AND 4.00),  -- GPA range between 0.00 and 4.00
    class_year ENUM ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate') NOT NULL,  -- Classification based on credits
    FOREIGN KEY (username) REFERENCES Account(username) ON DELETE CASCADE  -- Delete student details if account is deleted
);

-- ===========================================
-- Course Table: Stores course-related details
-- ===========================================
CREATE TABLE Course (
    course_id CHAR(10) PRIMARY KEY,  -- Unique course identifier (e.g., "01:198:431")
    course_name VARCHAR(200) NOT NULL,  -- Name of the course
    credits INT NOT NULL CHECK (credits > 0),  -- Number of credits (must be >0)
    description TEXT  -- Course description
);

-- ================================================
-- CourseTaken Table: Tracks student course history
-- ================================================
CREATE TABLE CourseTaken (
    username VARCHAR(6) NOT NULL,  -- Student who took the course
    course_id CHAR(10) NOT NULL,  -- Course identifier
    term ENUM ('Fall', 'Spring', 'Summer', 'Winter'),  -- Term of completion
    year YEAR,  -- Year of completion
    grade VARCHAR(2) CHECK (grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PA', 'NC', 'W')),  -- Grade received
    PRIMARY KEY (username, course_id, term, year),
    FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);

-- ========================================
-- Program Table: Defines academic programs
-- ========================================
CREATE TABLE Program (
    program_id VARCHAR(7) PRIMARY KEY,  -- Unique program identifier (e.g., "NB198SJ")
    program_name VARCHAR(200) NOT NULL,  -- Name of the program
    program_type ENUM ('Major', 'Minor', 'Certificate') NOT NULL,  -- Type of program
    is_credit_intensive BOOLEAN NOT NULL DEFAULT FALSE  -- Flag for credit-intensive programs
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
	program_id VARCHAR(7), -- ID of the program that this requirement group applies to
	course_id CHAR(10), -- ID of the course that this requirement group applies to
	logic ENUM ('AND', 'OR') DEFAULT NULL, -- Logic used to combine the courses in this group
	min_required INT DEFAULT NULL, -- Minimum number of courses required from the list of courses in the group (if applicable)
	list JSON DEFAULT NULL, -- JSON field to store a list of courses that are part of this group
	parent_group_id INT DEFAULT NULL, -- Parent group ID that links this group to another higher-level group
	FOREIGN KEY (program_id) REFERENCES Program (program_id) ON DELETE CASCADE, 
	FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE, 
	FOREIGN KEY (parent_group_id) REFERENCES RequirementGroup (group_id) ON DELETE CASCADE
);

-- ================================================
-- DegreePlan Table: Stores a student's degree plan
-- ================================================
CREATE TABLE DegreePlan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(6) NOT NULL,  
    plan_name VARCHAR(50),  -- Name of the plan (e.g., "CS 4-Year Plan")
    last_updated DATE NOT NULL,  -- Last modification date
    FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE
);

-- ===========================================================
-- PlannedCourse Table: Tracks planned courses per degree plan
-- ===========================================================
CREATE TABLE PlannedCourse (
    plan_id INT NOT NULL,
    course_id CHAR(10) NOT NULL,
    term ENUM ('Fall', 'Spring', 'Summer', 'Winter') NOT NULL, 
    year YEAR NOT NULL, 
    PRIMARY KEY (plan_id, course_id),
    FOREIGN KEY (plan_id) REFERENCES DegreePlan (plan_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);

-- =======================================================
-- SchedulePlan Table: Stores schedules for specific terms
-- =======================================================
CREATE TABLE SchedulePlan (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(6) NOT NULL, 
    schedule_name VARCHAR(50),  -- Custom name for the schedule
    last_updated DATE NOT NULL,  -- Last modification date
    term ENUM ('Fall', 'Spring', 'Summer', 'Winter') NOT NULL, 
    year YEAR NOT NULL, 
    FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE
);

-- ================================================================
-- Section Table: Stores course sections and instructor information
-- ================================================================
CREATE TABLE Section (
    schedule_id INT NOT NULL,
    course_id CHAR(10) NOT NULL,
    section_num CHAR(2) NOT NULL,  -- Section number (e.g., "01")
    index_num CHAR(5) NOT NULL,  -- Index number for registration
    instructor VARCHAR(50) NOT NULL,  -- Instructor's name
    PRIMARY KEY (schedule_id, course_id, section_num),
    FOREIGN KEY (schedule_id) REFERENCES SchedulePlan (schedule_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);