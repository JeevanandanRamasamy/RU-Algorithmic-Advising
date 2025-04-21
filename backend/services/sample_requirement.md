### Henry Nguyen -- Degree Planner Plan

## Sample DB queries

/_ CS Bachelor of Science Program _/

-- R1: Top-Level CS Core Group
INSERT INTO RequirementGroup (group_name, program_id, course_id, num_required, list, parent_group_id)
VALUES ('Computer Science Core', 'NB198SJ', NULL, 2, NULL, NULL);
SET @r1 = LAST_INSERT_ID();

-- R1 Subgroup: Set A (Take 5 of 6)
INSERT INTO RequirementGroup (group_name, program_id, course_id, num_required, list, parent_group_id)
VALUES ('CS Core - Set A', NULL, NULL, 5, '["01:198:111", "01:198:112", "01:198:205", "01:198:211", "01:198:344"]', @r1);

-- R1 Subgroup: Set B (Take 1)
INSERT INTO RequirementGroup (group_name, program_id, course_id, num_required, list, parent_group_id)
VALUES ('CS Core - Set B', NULL, NULL, 1, '["01:198:206", "01:640:477", "14:332:226"]', @r1);

-- R2: Mathematics Core
INSERT INTO RequirementGroup (group_name, program_id, course_id, num_required, list, parent_group_id)
VALUES ('Mathematics Core', 'NB198SJ', NULL, 3, '["01:640:151", "01:640:152", "01:640:250"]', NULL);

-- R3: Computer Science Electives
INSERT INTO RequirementGroup (group_name, program_id, course_id, num_required, list, parent_group_id)
VALUES ('Computer Science Electives', 'NB198SJ', NULL, 7, NULL, NULL);
SET @r3 = LAST_INSERT_ID();

-- R3 Subgroup: CS Department Electives
INSERT INTO RequirementGroup (group_name, program_id, course_id, num_required, list, parent_group_id)
VALUES ('CS Department Electives', NULL, NULL, 5, NULL, @r3);

-- R4: Physics or Chemistry (Parent Group)
INSERT INTO RequirementGroup (group_name, program_id, num_required, list, parent_group_id)
VALUES ('Physics or Chemistry Courses', 'NB198SJ', 1, NULL, NULL);
SET @r4 = LAST_INSERT_ID();

-- R4 Subgroups
INSERT INTO RequirementGroup (group_name, program_id, num_required, list, parent_group_id) VALUES
('Physics Sequence A', NULL, 4, '["01:750:271", "01:750:272", "01:750:275", "01:750:276"]', @r4),
('Physics Sequence B', NULL, 4, '["01:750:203", "01:750:204", "01:750:205", "01:750:206"]', @r4),
('Physics Sequence C', NULL, 4, '["01:750:123", "01:750:124", "01:750:227", "01:750:229"]', @r4),
('Physics Sequence D', NULL, 2, '["01:750:193", "01:750:194"]', @r4),
('Chemistry Sequence A', NULL, 3, '["01:160:159", "01:160:160", "01:160:171"]', @r4),
('Chemistry Sequence B', NULL, 3, '["01:160:161", "01:160:162", "01:160:171"]', @r4);

-- R5: Residency Requirement (standalone)
INSERT INTO RequirementGroup (group_name, program_id, num_required, list, parent_group_id)
VALUES ('Residency Requirement in RU-NB – Types: Major', 'NB198SJ', 7, NULL, NULL);

## Sample additional tables to create to be more specific (Do not copy and paste this, just for planning purposes)

    <!-- CREATE TABLE ElectiveCourse (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_code VARCHAR(20) NOT NULL,
        department VARCHAR(10), -- Optional
        elective_type VARCHAR(50), -- e.g. 'CS', 'Math', 'Stats'
        notes TEXT -- Optional field for constraints (e.g. "Only CS dept", "Max 2 non-CS allowed")
    );


    {
    "NB198SJ": {
        "CS_ELECTIVES": [
        "01:198:210", "01:198:213", "01:198:214", "01:198:336",
        "01:198:439", "01:198:462", "01:640:338", "01:730:315"
        ],
        "MAX_NON_CS": 2
    }
    }

CREATE TABLE RequirementNote (
note_id SERIAL PRIMARY KEY,
group_id INT REFERENCES RequirementGroup(group_id),
note TEXT
);

INSERT INTO RequirementNote (group_id, note)
VALUES (5, 'You must achieve a minimum grade of C for {01:198:111, 01:198:112, 01:198:205, 01:640:151, 01:640:152}.');

    CREATE TABLE CompletedCourse (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(user_id), -- assuming you have a Users table
        course_id VARCHAR(20),  -- ex: '01:198:205'
        semester VARCHAR(20),   -- ex: 'Fall 2023'
        grade CHAR(2),          -- ex: 'A', 'B', 'D'
        credits INT
    );


    INSERT INTO CompletedCourse (user_id, course_id, semester, grade, credits)
    VALUES
    (1, '01:198:205', 'Fall 2023', 'B', 4),
    (1, '01:198:211', 'Fall 2023', 'A', 4),
    (1, '01:198:213', 'Fall 2024', 'B', 4),
    (1, '01:198:336', 'Summer 2024', 'A', 4),
    (1, '01:198:352', 'Summer 2024', 'A', 4),
    (1, '01:198:419', 'Fall 2024', 'A', 4),
    (1, '01:198:440', 'Fall 2024', 'A', 4); -->

## Stuff to implement
