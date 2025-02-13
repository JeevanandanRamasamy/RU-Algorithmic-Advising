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

CREATE TABLE Account (
	username VARCHAR(6) PRIMARY KEY, 
	password VARCHAR(30), 
	first_name VARCHAR(50), 
	last_name VARCHAR(50), 
	role ENUM ('Student', 'Admin') NOT NULL DEFAULT 'Student'
);

CREATE TABLE StudentDetails (
	username VARCHAR(6) PRIMARY KEY, 
	grad_date YEAR, 
	enroll_date YEAR, 
	credits_earned INT CHECK (credits_earned >= 0), 
	gpa DECIMAL(3, 2) CHECK (gpa BETWEEN 0.00 AND 4.00), 
	class_year ENUM ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate') NOT NULL, 
	FOREIGN KEY (username) REFERENCES Account(username) ON DELETE CASCADE
);

CREATE TABLE Course (
	course_id CHAR(10) PRIMARY KEY, 
	course_name VARCHAR(200) NOT NULL, 
	credits INT NOT NULL CHECK (credits > 0), 
	description TEXT
);

CREATE TABLE CourseTaken (
	username VARCHAR(6) NOT NULL, 
	course_id CHAR(10) NOT NULL, 
	term ENUM ('Fall', 'Spring', 'Summer', 'Winter'), 
	year YEAR, 
	grade VARCHAR(2) CHECK (grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PA', 'NC', 'W')), 
	PRIMARY KEY (username, course_id, term, year), 
	FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE, 
	FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);

CREATE TABLE Program (
	program_id VARCHAR(7) PRIMARY KEY, 
	program_name VARCHAR(200) NOT NULL, 
	program_type ENUM ('Major', 'Minor', 'Certificate') NOT NULL
);

CREATE TABLE StudentProgram (
	username VARCHAR(6) NOT NULL, 
	program_id VARCHAR(7) NOT NULL, 
	PRIMARY KEY (username, program_id), 
	FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE, 
	FOREIGN KEY (program_id) REFERENCES Program (program_id) ON DELETE CASCADE
);

CREATE TABLE RequirementGroup (
	group_id INT AUTO_INCREMENT PRIMARY KEY, 
	program_id VARCHAR(7), 
	course_id CHAR(10), 
	logic ENUM ('AND', 'OR') NOT NULL, 
	parent_group_id INT, 
	FOREIGN KEY (program_id) REFERENCES Program (program_id) ON DELETE CASCADE, 
	FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE, 
	FOREIGN KEY (parent_group_id) REFERENCES RequirementGroup (group_id) ON DELETE CASCADE, 
	CONSTRAINT chk_program_course CHECK (
		(program_id IS NOT NULL AND course_id IS NULL) OR
		(course_id IS NOT NULL AND program_id IS NULL)
    )
);

CREATE TABLE Requirement (
	group_id INT NOT NULL, 
	course_id VARCHAR(10) NOT NULL, 
	PRIMARY KEY (group_id, course_id), 
	FOREIGN KEY (group_id) REFERENCES RequirementGroup (group_id) ON DELETE CASCADE, 
	FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE
);

CREATE TABLE DegreePlan (
	plan_id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(6) NOT NULL,  
	plan_name VARCHAR(50),
	last_updated DATE NOT NULL,
	FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE
);

CREATE TABLE PlannedCourse (
	plan_id INT NOT NULL,
	course_id CHAR(10) NOT NULL,
	term ENUM ('Fall', 'Spring', 'Summer', 'Winter') NOT NULL, 
	year YEAR NOT NULL, 
	PRIMARY KEY (plan_id, course_id),
	FOREIGN KEY (plan_id) REFERENCES DegreePlan (plan_id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);

CREATE TABLE SchedulePlan (
	schedule_id INT AUTO_INCREMENT PRIMARY KEY, 
	username VARCHAR(6) NOT NULL, 
	schedule_name VARCHAR(50),
	last_updated DATE NOT NULL,
	term ENUM ('Fall', 'Spring', 'Summer', 'Winter') NOT NULL, 
	year YEAR NOT NULL, 
	FOREIGN KEY (username) REFERENCES StudentDetails (username) ON DELETE CASCADE
);

CREATE TABLE Section (
	schedule_id INT NOT NULL,
	course_id CHAR(10) NOT NULL,
	section_num CHAR(2) NOT NULL,
	index_num CHAR(5) NOT NULL,
	instructor VARCHAR(50) NOT NULL,
	PRIMARY KEY (schedule_id, course_id, section_num),
	FOREIGN KEY (schedule_id) REFERENCES SchedulePlan (schedule_id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES Course (course_id) ON DELETE CASCADE
);