USE RUAA; -- Switch to the RUAA database

-- Add programs into database

(7, NULL, NULL, NULL)
-- Undeclared
INSERT INTO Program (program_id, program_name, program_type, is_credit_intensive, additional_details)
VALUES ('NB013AN', 'Minor in African Languages', FALSE, NULL, "You must achieve a minimum grade of C for {AllCourses} in any requirements or conditions. 01:013:192, 193, 292, 293, 392, 393 may substitute for the 01:973 versions of the Twi language courses.")

INSERT INTO RequirementGroup (group_id, program_id, course_id, logic, min_courses_required, min_credits_required, list, parent_group_id)
(1, 'NB013AN', NULL, "AND", NULL, NULL, NULL)
(2, NULL, NULL, "OR", NULL, NULL, 1),
(3, NULL, NULL, NULL, 4, NULL, '["01:013:140", "01:013:141", "01:013:240", "01:013:241", "01:013:242", "01:013:243", "01:013:340", "01:013:341", "01:013:442", "01:074:140", "01:074:141",
"01:074:240", "01:074:241", "01:074:340", "01:074:341"]', 2),
(4, NULL, NULL, NULL, 4, NULL, '["01:013:186", "01:013:187", "01:013:286", "01:013:287", "01:013:386", "01:013:387", "01:956:186", "01:956:187", "01:956:286", "01:956:287", "01:956:386",
"01:956:387"]', 2),
(5, NULL, NULL, NULL, 4, NULL, '["01:974:192", "01:974:193", "01:974:292", "01:974:293", "01:974:392", "01:974:393"]', 2),
(6, NULL, NULL, NULL, 4, NULL, '["01:974:192", "01:974:193", "01:974:292", "01:974:293", "01:974:392", "01:974:393"]', 2),
(7, NULL, NULL, "OR", NULL, NULL, 1),
(8, NULL, NULL, NULL, 2, NULL, '["01:013:340", "01:013:341", "01:013:386", "01:013:387", "01:013:394", "01:013:395", "01:013:442", "01:074:340", "01:074:341", "01:956:386", "01:956:387"]', 7),
(9, NULL, NULL, NULL, 2, NULL, '["01:013:201, 01:013:312, 01:013:211"]', 7)



INSERT INTO Program (program_id, program_name, program_type, is_credit_intensive, additional_details)
VALUES ('NB013J', 'Major in African, Middle Eastern and South Asian Languages and Literatures (AMESALL) - Regional Option', FALSE, NULL, "Majors are highly encouraged to join a study abroad program before graduation. Depending on the curriculum of the specific Study Abroad program, majors could fulfill up to 8 credits of language/literature requirements through the study abroad experience. Note: The course numbers for Persian, Turkish and Twi have changed. The old 013 versions of these courses can substitute for the new 723 (Persian), 973 (Turkish) and 974 (Tiwi) classes."),

INSERT INTO RequirementGroup (group_id, program_id, course_id, logic, min_courses_required, min_credits_required, list, parent_group_id)
(10, "NB013J", NULL, NULL, "AND", NULL, NULL, NULL)
(11, NULL, NULL, NULL, 1, NULL, '["01:013:201"]', 10)
(12, NULL, NULL, NULL, 1, NULL, '["01:013:401"]', 10)
(13, NULL, NULL, NULL, NULL, 6, '["01:013:340", "01:013:341", "01:013:352", "01:013:353", "01:013:360", "01:013:361", "01:013:386", "01:013:387", "01:013:405", "01:013:421", "01:013:422",
"01:723:376", "01:723:377", "01:973:390", "01:973:391"]', 10)
(14, NULL, NULL, NULL, 1, NULL, '["01:013:211", "01:013:221", "01:013:231"]', 10)
(15, NULL, NULL, NULL, NULL, 18, '"01:013:111", "01:013:145", "01:013:203", "01:013:206", "01:013:210", "01:013:220", "01:013:242", "01:013:243", "01:013:285", "01:013:289", "01:013:301",
"01:013:302", "01:013:304", "01:013:305", "01:013:306", "01:013:307", "01:013:308", "01:013:311", "01:013:312", "01:013:313", "01:013:314", "01:013:315", "01:013:316", "01:013:317", "01:013:318",
"01:013:320", "01:013:321", "01:013:322", "01:013:324", "01:013:325", "01:013:329", "01:013:331", "01:013:335", "01:013:337", "01:013:342", "01:013:343", "01:013:346", "01:013:354", "01:013:355",
"01:013:365", "01:013:372", "01:013:378", "01:013:379", "01:013:392", "01:013:396", "01:013:397", "01:013:401", "01:013:402", "01:013:403", "01:013:404", "01:013:409", "01:013:410", "01:013:412",
"01:013:430", "01:013:442", "01:013:445", "01:013:452", "01:013:453", "01:013:454", "01:013:455", "01:013:476", "01:013:477"]', 10)
(16, NULL, NULL, NULL, NULL, 9, '["01:013:301", "01:013:302", "01:013:304", "01:013:305", "01:013:306", "01:013:307", "01:013:308", "01:013:311", "01:013:312", "01:013:313", "01:013:314",
"01:013:315", "01:013:316", "01:013:317", "01:013:318", "01:013:320", "01:013:321", "01:013:322", "01:013:324", "01:013:325", "01:013:329", "01:013:331", "01:013:335", "01:013:337", "01:013:342",
"01:013:343", "01:013:346", "01:013:354", "01:013:355", "01:013:365", "01:013:372", "01:013:378", "01:013:379", "01:013:392", "01:013:396", "01:013:397", "01:013:401", "01:013:402", "01:013:403",
"01:013:404", "01:013:409", "01:013:410", "01:013:412", "01:013:430", "01:013:442", "01:013:445", "01:013:452", "01:013:453", "01:013:454", "01:013:455", "01:013:476", "01:013:477",]', 10)

INSERT INTO Program (program_id, program_name, program_type, is_credit_intensive, additional_details)
VALUES ('NB013N', 'Minor in African, Middle Eastern and South Asian Languages and Literatures (AMESALL) (NB)', FALSE, NULL, "You must achieve a minimum grade of C for {AllCourses} in any requirements or conditions. The course numbers for Persian, Turkish have changed. The old 013 versions of these courses can substitute for the new 723 (Persian), 973 (Turkish) classes.")


INSERT INTO RequirementGroup (group_id, program_id, course_id, logic, min_courses_required, min_credits_required, list, parent_group_id)
(17, "NB013N", NULL, NULL, "AND", NULL, NULL, NULL),
(18, NULL, NULL, NULL, "OR", NULL, NULL, NULL, 17),
(19, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:232", "01:013:250", "01:013:251"]', 18),
(20, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:286", "01:013:287", "01:013:335", "01:013:386", "01:013:387"]', 18),
(21, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:210", "01:013:296", "01:013:297", "01:013:309", "01:013:310"]', 18),
(22, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:294", "01:013:295", "01:013:337", "01:013:394", "01:013:395"]', 18),
(23, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:246", "01:013:247"]', 18),
(24, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:260", "01:013:261"]', 18),
(25, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:280", "01:013:281"]', 18),
(26, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:240", "01:013:241", "01:013:242", "01:013:243", "01:013:340", "01:013:341", "01:013:442", "01:074:240", "01:074:241", "01:074:340", "01:074:341"]', 18),
(27, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:252", "01:013:253", "01:013:352", "01:013:353", "01:563:121", "01:563:131", "01:563:132", "01:563:210", "01:563:211", "01:563:371", "01:563:372",
"01:563:431", "01:563:433", "01:563:434", "01:563:437", "01:563:471", "01:563:472", "01:563:484", "01:563:485", "01:685:371", "01:685:372", "01:685:471"]', 18),
(28, NULL, NULL, NULL, NULL, 2, NULL, '["01:723:276", "01:723:277", "01:723:376", "01:723:377"]', 18),
(29, NULL, NULL, NULL, NULL, 2, NULL, '["01:973:290", "01:973:291", "01:973:390", "01:973:391"]', 18)
(30, NULL, NULL, NULL, NULL, 1, NULL, '["01:013:201"]', 17),
(31, NULL, NULL, NULL, NULL, 1, NULL, '["01:013:211", "01:013:221", "01:013:231"]', 17),
(32, NULL, NULL, NULL, NULL, 2, NULL, '["01:013:301", "01:013:302", "01:013:304", "01:013:305", "01:013:306", "01:013:307", "01:013:308", "01:013:311", "01:013:312", "01:013:313", "01:013:314", "01:013:315", "01:013:316", "01:013:317",
"01:013:318", "01:013:320", "01:013:321", "01:013:322", "01:013:324", "01:013:325", "01:013:329", "01:013:331", "01:013:335", "01:013:337", "01:013:340", "01:013:341", "01:013:342", "01:013:343",
"01:013:346", "01:013:352", "01:013:353", "01:013:354", "01:013:355", "01:013:360", "01:013:361", "01:013:365", "01:013:372", "01:013:376", "01:013:377", "01:013:378", "01:013:379", "01:013:386",
"01:013:387", "01:013:390", "01:013:391", "01:013:392", "01:013:394", "01:013:395", "01:013:396", "01:013:397", "01:013:400", "01:013:401", "01:013:402", "01:013:403", "01:013:404", "01:013:405",
"01:013:409", "01:013:410", "01:013:412", "01:013:421", "01:013:422", "01:013:430", "01:013:442", "01:013:445", "01:013:452", "01:013:453", "01:013:454", "01:013:455", "01:013:476", "01:013:477"]', 17)


INSERT INTO Program (program_id, program_name, program_type, is_credit_intensive, additional_details)
VALUES ('NB014J', 'Major in Africana Studies (NB)', FALSE, NULL, "Students participating in one- or two-semester study abroad programs in countries of the African diaspora -- Brazil, Costa Rica, Ghana, Kenya, Morocco, Namibia, and South Africa -- can receive course credit (in consultation with the chair) toward the Africana Studies major or minor. You must achieve a minimum grade of C for {AllCourses} in requirements"),


INSERT INTO Program (program_id, program_name, program_type, is_credit_intensive, additional_details)
VALUES ('NB014N', 'Minor in Africana Studies (NB)', FALSE, NULL, "You must achieve a minimum grade of C for {AllCourses} in requirements. To compliment the minor in Africana studies, the department recommends, but does not require, two terms of instruction in a foreign language taught by the Department of Africana Studies."),


INSERT INTO Program (program_id, program_name, program_type, is_credit_intensive, additional_details)
VALUES ('NB016N', '	Minor in African Area Studies (NB)', FALSE, NULL, "You must achieve a minimum grade of C for {AllCourses} in requirements. Credits earned through relevant honors or topics courses, independent study, internships and study abroad in Africa can be applied towards the electives requirements and may in some cases, with the approval of the Director of the Program in African Languages, be applied towards the language requirement. At least three courses must be taken outside the student's major. Students are strongly advised to consult with the Curriculum Director regularly abut their programs of study."),
