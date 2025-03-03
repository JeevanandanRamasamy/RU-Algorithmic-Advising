function getMenuItemsFromString(inputString) {
	// Regular expression to match divs with class "dijitReset dijitMenuItem"
	const regex = /<div[^>]*class=["'](?:dijitReset\s+dijitMenuItem)["'][^>]*>(.*?)<\/div>/g;

	// Extract the inner content of matching divs
	const res = [];
	let match;

	while ((match = regex.exec(inputString)) !== null) {
		res.push(match[1].trim());
	}

	return res;
}

// const htmlString = `'<div class="dijitReset dijitMenuItem" role="option" item="0" id="dijit_form_FilteringSelect_1_popup0">01 - School of Arts &amp; Sciences</div><div class="dijitReset dijitMenuItem" role="option" item="1" id="dijit_form_FilteringSelect_1_popup1">03 - Military Science</div><div class="dijitReset dijitMenuItem" role="option" item="2" id="dijit_form_FilteringSelect_1_popup2">04 - School of Communication &amp; Info (U)</div><div class="dijitReset dijitMenuItem" role="option" item="3" id="dijit_form_FilteringSelect_1_popup3">05 - Graduate School of Education (U)</div><div class="dijitReset dijitMenuItem" role="option" item="4" id="dijit_form_FilteringSelect_1_popup4">07 - Mason Gross School of the Arts (U)</div><div class="dijitReset dijitMenuItem" role="option" item="5" id="dijit_form_FilteringSelect_1_popup5">09 - School of Social Work (U)</div><div class="dijitReset dijitMenuItem" role="option" item="6" id="dijit_form_FilteringSelect_1_popup6">10 - Bloustein School of Planning (U)</div><div class="dijitReset dijitMenuItem" role="option" item="7" id="dijit_form_FilteringSelect_1_popup7">11 - School of Environmental &amp; Biological Sci</div><div class="dijitReset dijitMenuItem" role="option" item="8" id="dijit_form_FilteringSelect_1_popup8">13 - Grad School of Applied &amp; Prof Psych (U)</div><div class="dijitReset dijitMenuItem" role="option" item="9" id="dijit_form_FilteringSelect_1_popup9">14 - School of Engineering</div><div class="dijitReset dijitMenuItem" role="option" item="10" id="dijit_form_FilteringSelect_1_popup10">30 - Ernest Mario School of Pharmacy (U)</div><div class="dijitReset dijitMenuItem" role="option" item="11" id="dijit_form_FilteringSelect_1_popup11">33 - Rutgers Business School- NB campus (U)</div><div class="dijitReset dijitMenuItem" role="option" item="12" id="dijit_form_FilteringSelect_1_popup12">37 - School of Management &amp; Labor Rel (U)</div><div class="dijitReset dijitMenuItem" role="option" item="13" id="dijit_form_FilteringSelect_1_popup13">77 - School of Nursing - New Brunswick (U)</div><div class="dijitMenuItem dijitMenuNextButton" data-dojo-attach-point="nextButton" role="option" style="display: none;" id="dijit_form_FilteringSelect_1_popup_next">More choices</div></div>'`;
// res = getMenuItemsFromString(htmlString);
// console.log(res);

// res = [
// 	"Minor in African Languages (NB)",
// 	"Minor in African, Middle Eastern and South Asian Languages and Literatures (AMESALL) (NB)",
// 	"Minor in Africana Studies (NB)",
// 	"Minor in African Area Studies (NB)",
// 	"Minor in Agroecology - SEBS (NB)",
// 	"Minor in Agriculture and Food Systems (NB)",
// 	"Minor in American Studies (NB)",
// 	"Minor in Asian American Studies (NB)",
// 	"Minor in Animal Science - SEBS (NB)",
// 	"Minor in Cultural Anthropology (NB)",
// 	"Minor in Anthropology (NB)",
// 	"Minor in Evolutionary Anthropology (NB)",
// 	"Minor in Arabic (NB)",
// 	"Minor in Archaeology (NB)",
// 	"Minor in Architectural Studies (NB)",
// 	"Minor in Animation (NB)",
// 	"Minor in Art (NB)",
// 	"Minor in Art History (NB)",
// 	"Minor in Arts Management and Leadership (NB)",
// 	"Minor in Asian Studies (NB)",
// 	"Minor in Astronomy (NB)",
// 	"Minor in Astrobiology (NB)",
// 	"Minor in Biochemistry - SEBS (NB)",
// 	"Minor in Biological Sciences (Biology) (NB)",
// 	"Minor in Business Administration (NB)",
// 	"Minor in Chemistry Education (NB)",
// 	"Minor in Chemistry (NB)",
// 	"Minor in Chinese (NB)",
// 	"Minor in Cinema Studies (NB)",
// 	"Minor in Cognitive Science (NB)",
// 	"Minor in Classical Humanities (NB)",
// 	"Minor in Community Health Outreach (SEBS) (NB)",
// 	"Minor in Comparative Literature (NB)",
// 	"Minor in Computer Science (NB)",
// 	"Minor in Comparative and Critical Race and Ethnic Studies (CCRES) (NB)",
// 	"Minor in Creative Expression and the Environment (NB)",
// 	"Minor in Dance (NB)",
// 	"Minor in Criminology (NB)",
// 	"Minor in Critical Intelligence Studies (NB)",
// 	"Minor in Digital Communication, Information, and Media (DCIM) (NB)",
// 	"Minor in Ecology, Evolution and Natural Resources - SEBS (NB)",
// 	"Minor in Data Science (NB)",
// 	"Minor in Economics (NB)",
// 	"Minor in Quantitative Economics (NB)",
// 	"Minor in Education as a Social Science (NB)",
// 	"Minor in Disability Studies (NB)",
// 	"Minor in English (NB)",
// 	"Minor in Creative Writing (NB)",
// 	"Minor in Business and Technical Writing (NB)",
// 	"Minor in European Studies (NB)",
// 	"Minor in Entomology (NB)",
// 	"Minor in Environmental and Business Economics - SEBS (NB)",
// 	"Minor in Environmental Policy, Institutions, and Behavior (EPIB) (NB)",
// 	"Minor in Environmental Sciences - SEBS (NB)",
// 	"Minor in Environmental Planning - SEBS (NB)",
// 	"Minor in Environmental Studies (NB)",
// 	"Minor in Entrepreneurship (NB)",
// 	"Minor in Health Equity (NB)",
// 	"Minor in Fisheries Science (NB)",
// 	"Minor in Food Science (NB)",
// 	"Minor in French (NB)",
// 	"Minor in Gender and Media (NB)",
// 	"Minor in Geography (NB)",
// 	"Minor in Earth and Planetary Sciences (NB)",
// 	"Minor in German (NB)",
// 	"Minor in Green Technologies - SEBS (NB)",
// 	"Minor in Greek (Modern) (NB)",
// 	"Minor in Greek (Ancient) (NB)",
// 	"Minor in Health Administration (NB)",
// 	"Minor in Health and Society (NB)",
// 	"Minor in Hindi (NB)",
// 	"Minor in History (NB)",
// 	"Minor in History - Law and History (NB)",
// 	"Minor in History - STEM in Society (NB)",
// 	"Minor in Horticultural Therapy (SEBS) (NB)",
// 	"Minor in Human Resource Management (NB)",
// 	"Minor in Hungarian (NB)",
// 	"Minor in International and Global Studies (NB)",
// 	"Minor in Italian Studies (NB)",
// 	"Minor in Italian (NB)",
// 	"Minor in Jewish Studies (NB)",
// 	"Minor in Holocaust Studies (NB)",
// 	"Minor in Japanese (NB)",
// 	"Minor in Environmental Geomatics (SEBS) (NB)",
// 	"Minor in Korean (NB)",
// 	"Minor in Labor Studies - Diversity in the Workplace Option (NB)",
// 	"Minor in Labor Studies - Work, Globalization, and Migration Option (NB)",
// 	"Minor in Labor Studies - Law and the Workplace Option (NB)",
// 	"Minor in Labor Studies - Work Organization and Management Option (NB)",
// 	"Minor in Labor Studies (NB)",
// 	"Minor in Labor Studies - Labor Unions and Social Movements Option (NB)",
// 	"Minor in Latin (NB)",
// 	"Minor in Landscape Design (NB)",
// 	"Minor in Language and Culture of Ancient Israel (NB)",
// 	"Minor in Latin American Studies (NB)",
// 	"Minor in Latino and Caribbean Studies (NB)",
// 	"Minor in Leadership Skills - SEBS (NB)",
// 	"Minor in Linguistics (NB)",
// 	"Minor in Marine Sciences (NB)",
// 	"Minor in Mathematics (NB)",
// 	"Minor in Medical Ethics and Health Policy (NB)",
// 	"Minor in Medicinal and Economic Botany - SEBS (NB)",
// 	"Minor in Medieval Studies (NB)",
// 	"Minor in Meteorology - SEBS (NB)",
// 	"Minor in Music Technology (NB)",
// 	"Minor in Microbiology - SEBS (NB)",
// 	"Minor in Middle Eastern Studies (NB)",
// 	"Minor in Military Science - Military Science Track",
// 	"Minor in Military Science - Naval Science Track",
// 	"Minor in Military Science- Aerospace Science",
// 	"Minor in Military Science - Non-commissioning Track",
// 	"Minor in Nonprofit Leadership (SEBS) (NB)",
// 	"Minor in Music (NB)",
// 	"Minor in Nutrition - SEBS (NB)",
// 	"Minor in Culinary Nutrition (NB)",
// 	"Minor in Organizational Leadership (NB)",
// 	"Minor in Persian (NB)",
// 	"Minor in Philosophy (NB)",
// 	"Minor in Physics (NB)",
// 	"Minor in Plant Science (SEBS) (NB)",
// 	"Minor in Political Science (NB)",
// 	"Minor in Philosophy, Politics, and Economics (PPE) (NB)",
// 	"Minor in Government and Business (NB)",
// 	"Minor in Portuguese (NB)",
// 	"Minor in Public Garden Management - SEBS (NB)",
// 	"Minor in Psychology (NB)",
// 	"Minor in Public Health (NB)",
// 	"Minor in Public Policy (NB)",
// 	"Minor in Developmental Psychology (NB)",
// 	"Minor in Religion (NB)",
// 	"Minor in Public Administration and Management (NB)",
// 	"Minor in Russian (NB)",
// 	"Minor in Slavic and Eastern European Studies (NB)",
// 	"Minor in Science Communication - SEBS (NB)",
// 	"Minor in Sexualities Studies (NB)",
// 	"Minor in Social Justice (NB)",
// 	"Minor in Sociology (NB)",
// 	"Minor in South Asian Studies (NB)",
// 	"Minor in Spanish (NB)",
// 	"Minor in Sport Management (NB)",
// 	"Minor in Sustainable Global Food Systems - SEBS (NB)",
// 	"Minor in Statistics (NB)",
// 	"Minor in Sustainability - SEBS (NB)",
// 	"Minor in Theater Arts (NB)",
// 	"Minor in Urban Planning and Design (NB)",
// 	"Minor in Urban Forestry (SEBS) (NB)",
// 	"Minor in Turkish (NB)",
// 	"Minor in Urban Studies (NB)",
// 	"Minor in Women's and Gender Studies (NB)"
// ];

// function cleanStrings(strings) {
// 	return strings.map(s =>
// 		s
// 			.replace(/^Minor in /, "")
// 			.replace(/\s*\(.*\)$/, "")
// 			.replace(/^ (NB) /, "")
// 	);
// }
// a = cleanStrings(res);
// const joinedString = [...a].map(item => `"${item}"`).join(", ");
// joinedString;

// res = [
// 	"Accounting",
// 	"Global Humanities",
// 	"African, Middle Eastern and South Asian Languages and Literatures",
// 	"Africana Studies",
// 	"Agriculture and Food Systems",
// 	"Agriculture and Food Systems: Teacher Education Track",
// 	"Agriculture and Food Systems",
// 	"American Studies",
// 	"Animal Science, Preveterinary Medicine and Research Option",
// 	"Animal Science, Companion Animal Science",
// 	"Animal Science, Laboratory Animal Science Option",
// 	"Animal Science, Equine and Production Animal Science",
// 	"Cultural Anthropology",
// 	"Anthropology",
// 	"Evolutionary Anthropology",
// 	"Art",
// 	"Visual Arts",
// 	"Art History",
// 	"Asian Studies",
// 	"Astrophysics",
// 	"Biochemistry - Biochemistry of Microbial Systems Option",
// 	"Biochemistry - Biochemical Toxicology Option",
// 	"Biochemistry - Biochemistry of Plant Systems Option",
// 	"Biochemistry - Protein and Structural Biochemistry Option",
// 	"Biochemistry - General Option",
// 	"Biological Sciences",
// 	"Biomathematics",
// 	"Biotechnology, Bioscience Policy and Management Option",
// 	"Biotechnology, Microbial Biotechnology Option",
// 	"Biotechnology, Bioinformatics Option",
// 	"Biotechnology, Plant Biotechnology Option",
// 	"Biotechnology, Animal Biotechnology Option",
// 	"Biotechnology, General Biotechnology Option",
// 	"Business Analytics and Information Technology",
// 	"Cell Biology and Neuroscience - Honors",
// 	"Cell Biology and Neuroscience",
// 	"Chemistry, Chemical Biology Option",
// 	"Chemistry, Environmental Option",
// 	"Chemistry, Business - Law Option",
// 	"Chemistry, Chemical Physics Option",
// 	"Chemistry, General ACS Option",
// 	"Chemistry, Core Option",
// 	"Chemistry, Forensic Chemistry Option",
// 	"Chinese",
// 	"Cinema Studies",
// 	"Cognitive Science",
// 	"Classics, Greek Option",
// 	"Classics, Greek and Latin Option",
// 	"Classics, Latin Option",
// 	"Classics, Classical Humanities Option",
// 	"Communication - Specialization in Health and Wellness Communication",
// 	"Communication",
// 	"Communication - Specialization in Leadership in Organizations and Community",
// 	"Communication - Specialization in Strategic Public Communication and Public Relations",
// 	"Communication - Specialization in Relationships and Family Communication",
// 	"Communication - Specialization in Communication and Technology",
// 	"Comparative Literature - Option in Advanced Studies in Comparative Literature",
// 	"Comparative Literature",
// 	"Computer Science - B.A.",
// 	"Computer Science - B.S.",
// 	"Criminal Justice",
// 	"Criminal Justice",
// 	"Dance",
// 	"Dance",
// 	"Dance - Dance Science Concentration",
// 	"Design",
// 	"Filmmaking",
// 	"Ecology, Evolution and Natural Resources - Urban Forestry Option",
// 	"Ecology, Evolution and Natural Resources",
// 	"Ecology, Evolution and Natural Resources - Nat Res & Ecosystem Mgmt Option",
// 	"Data Science - Chemical Data Science Option B.S.",
// 	"Data Science - Economics Option B.S.",
// 	"Data Science - Societal Impact Option B.A.",
// 	"Data Science - Computer Science Option B.S.",
// 	"Data Science - Statistics Option B.A.",
// 	"Economics",
// 	"English",
// 	"European Studies",
// 	"Entomology",
// 	"Environmental and Business Economics, Environmental and Natural Resource Economics Option",
// 	"Environmental and Business Economics, Food Industry Economics Option",
// 	"Environmental and Business Economics, Business Economics Option",
// 	"Environmental and Business Economics, Food Science and Management Economics",
// 	"Environmental Policy, Institutions and Behavior",
// 	"Environmental Sciences, Environmental Health Option",
// 	"Environmental Sciences, Environmental Science Option",
// 	"Environmental Sciences, Applied Environmental Science Option",
// 	"Exercise Science",
// 	"Exercise Science - Pre-Physical Therapy",
// 	"Environmental Studies",
// 	"Finance - Fixed Income and Credit Analysis Option",
// 	"Finance",
// 	"Food Science, One Pathway",
// 	"French- Interdisciplinary",
// 	"French",
// 	"Genetics",
// 	"Geography",
// 	"Earth and Planetary Sciences, Environmental Geology Option",
// 	"Earth and Planetary Sciences, Geological Sciences Option",
// 	"Earth and Planetary Sciences, General Option",
// 	"Earth and Planetary Sciences, Planetary Science Option",
// 	"German",
// 	"Health Administration - Direct Admits Option",
// 	"Health Administration",
// 	"History, Ancient History and Classics Option",
// 	"History",
// 	"History - French",
// 	"History - Political Science",
// 	"Human Resource Management - Honors",
// 	"Human Resource Management",
// 	"Information Technology and Informatics",
// 	"Landscape Architecture",
// 	"Interdisciplinary Studies-SEBS",
// 	"Italian Studies",
// 	"Italian",
// 	"Jewish Studies",
// 	"Jewish Studies - Advanced Language Option",
// 	"Japanese",
// 	"Journalism and Media Studies - Specialization in Global Media",
// 	"Journalism and Media Studies",
// 	"Journalism and Media Studies - Specialization in Sports Journalism",
// 	"Environmental Planning",
// 	"Korean",
// 	"Labor Studies and Employment Relations",
// 	"Labor and Employment Relations",
// 	"Labor and Employment Relations Online",
// 	"Labor and Employment Relations Online",
// 	"Latin American Studies",
// 	"Latino and Caribbean Studies",
// 	"Leadership and Management",
// 	"Linguistics with Certificate in Speech and Hearing Sciences",
// 	"Linguistics",
// 	"Marine Sciences, Marine Chemistry Option",
// 	"Marine Sciences, Marine Geology Option",
// 	"Marine Sciences, Physical Oceanography Option",
// 	"Marine Sciences, Directed Marine Studies Option",
// 	"Marine Sciences, Marine Biology - Biological Oceanography Option",
// 	"Marketing",
// 	"Marketing with Certification in Professional Selling",
// 	"Mathematics",
// 	"Mathematics, Actuarial Option",
// 	"Medieval Studies",
// 	"Meteorology",
// 	"Microbiology",
// 	"Middle Eastern Studies",
// 	"Middle Eastern Studies",
// 	"Molecular Biology and Biochemistry",
// 	"Music",
// 	"Music - Composition Option",
// 	"Music - Music Education Instrumental Option",
// 	"Music - Performance - Instrumental Option",
// 	"Music - Performance - Voice Option",
// 	"Music - Music Education Vocal General - Voice Option",
// 	"Music - Jazz Option",
// 	"Ecology, Evolution and Natural Resources",
// 	"Nursing - Blackwood Program",
// 	"Nursing - Accelerated Bachelor of Science in Nursing",
// 	"Nursing",
// 	"Nursing - RN-BS Degree",
// 	"Nutritional Sciences, Dietetics Option",
// 	"Nutritional Sciences, Food Service Administration Option",
// 	"Nutritional Sciences, Community Nutrition Option",
// 	"Nutritional Sciences - Pre-Dietetic",
// 	"Nutritional Sciences, Biomedical Nutrition Option",
// 	"Nutritional Sciences - Pre-Nutritional Sciences",
// 	"Pharmacy",
// 	"Philosophy",
// 	"Physics - Professional Option",
// 	"Physics - Engineering Dual Degree Option",
// 	"Physics - General Option",
// 	"Physics - Planetary Option",
// 	"Physics, Applied Option",
// 	"Planning and Public Policy - Direct Admits Option",
// 	"Plant Science, Plant Agriculture and Horticulture",
// 	"Plant Science, Natural Products",
// 	"Plant Science, General Plant Biology Option",
// 	"Political Science",
// 	"Supply Chain Management",
// 	"Portuguese",
// 	"Psychology - Honors",
// 	"Psychology",
// 	"Public Health - Direct Admits Option",
// 	"Public Health",
// 	"Public Policy - Direct Admits Option",
// 	"Public Policy",
// 	"Religion",
// 	"Russian",
// 	"Social Work",
// 	"Sociology",
// 	"Spanish - Spanish Intensive Option",
// 	"Spanish",
// 	"Sport Management",
// 	"Statistics",
// 	"Statistics - Mathematics",
// 	"Theater Arts",
// 	"Theater Arts - Acting Concentration",
// 	"Theater Arts - Acting Concentration",
// 	"Theater Arts - Costume Technology Concentration",
// 	"Theater Arts - Lighting Design Concentration",
// 	"Theater Arts - Stage Management Concentration",
// 	"Theater Arts - Costume Design Concentration",
// 	"Theater Arts - Technical Direction Concentration",
// 	"Theater Arts - Set Design Concentration",
// 	"Theater Arts - Dramaturgy Concentration",
// 	"Urban Planning and Design - Direct Admits Option",
// 	"Urban Planning and Design",
// 	"Women's and Gender Studies"
// ];

// a = new Set([
// 	"01:070:100",
// 	"01:070:101",
// 	"01:070:102",
// 	"01:070:104",
// 	"01:070:105",
// 	"01:070:108",
// 	"01:070:111",
// 	"01:070:112",
// 	"01:070:113",
// 	"01:070:152",
// 	"01:070:153",
// 	"01:070:161",
// 	"01:070:162",
// 	"01:070:163",
// 	"01:070:164",
// 	"01:070:170",
// 	"01:070:171",
// 	"01:070:201",
// 	"01:070:202",
// 	"01:070:203",
// 	"01:070:206",
// 	"01:070:207",
// 	"01:070:209",
// 	"01:070:212",
// 	"01:070:213",
// 	"01:070:215",
// 	"01:070:216",
// 	"01:070:217",
// 	"01:070:218",
// 	"01:070:219",
// 	"01:070:220",
// 	"01:070:221",
// 	"01:070:222",
// 	"01:070:223",
// 	"01:070:224",
// 	"01:070:225",
// 	"01:070:226",
// 	"01:070:227",
// 	"01:070:228",
// 	"01:070:230",
// 	"01:070:238",
// 	"01:070:240",
// 	"01:070:242",
// 	"01:070:243",
// 	"01:070:244",
// 	"01:070:246",
// 	"01:070:248",
// 	"01:070:250",
// 	"01:070:252",
// 	"01:070:283",
// 	"01:070:284",
// 	"01:070:291",
// 	"01:070:292",
// 	"01:070:293",
// 	"01:070:294",
// 	"01:070:295",
// 	"01:070:296",
// 	"01:070:297",
// 	"01:070:298",
// 	"01:070:299",
// 	"01:070:302",
// 	"01:070:303",
// 	"01:070:304",
// 	"01:070:305",
// 	"01:070:306",
// 	"01:070:307",
// 	"01:070:308",
// 	"01:070:309",
// 	"01:070:311",
// 	"01:070:312",
// 	"01:070:313",
// 	"01:070:314",
// 	"01:070:316",
// 	"01:070:317",
// 	"01:070:318",
// 	"01:070:319",
// 	"01:070:320",
// 	"01:070:321",
// 	"01:070:322",
// 	"01:070:323",
// 	"01:070:324",
// 	"01:070:325",
// 	"01:070:326",
// 	"01:070:327",
// 	"01:070:328",
// 	"01:070:329",
// 	"01:070:330",
// 	"01:070:331",
// 	"01:070:332",
// 	"01:070:333",
// 	"01:070:334",
// 	"01:070:335",
// 	"01:070:336",
// 	"01:070:337",
// 	"01:070:338",
// 	"01:070:339",
// 	"01:070:340",
// 	"01:070:341",
// 	"01:070:342",
// 	"01:070:343",
// 	"01:070:344",
// 	"01:070:345",
// 	"01:070:346",
// 	"01:070:347",
// 	"01:070:348",
// 	"01:070:349",
// 	"01:070:350",
// 	"01:070:351",
// 	"01:070:352",
// 	"01:070:354",
// 	"01:070:355",
// 	"01:070:356",
// 	"01:070:357",
// 	"01:070:358",
// 	"01:070:359",
// 	"01:070:360",
// 	"01:070:361",
// 	"01:070:362",
// 	"01:070:363",
// 	"01:070:365",
// 	"01:070:367",
// 	"01:070:368",
// 	"01:070:369",
// 	"01:070:370",
// 	"01:070:371",
// 	"01:070:372",
// 	"01:070:373",
// 	"01:070:374",
// 	"01:070:375",
// 	"01:070:376",
// 	"01:070:377",
// 	"01:070:378",
// 	"01:070:379",
// 	"01:070:380",
// 	"01:070:381",
// 	"01:070:382",
// 	"01:070:383",
// 	"01:070:384",
// 	"01:070:385",
// 	"01:070:386",
// 	"01:070:387",
// 	"01:070:388",
// 	"01:070:389",
// 	"01:070:390",
// 	"01:070:391",
// 	"01:070:392",
// 	"01:070:393",
// 	"01:070:394",
// 	"01:070:395",
// 	"01:070:396",
// 	"01:070:397",
// 	"01:070:398",
// 	"01:070:401",
// 	"01:070:402",
// 	"01:070:403",
// 	"01:070:404",
// 	"01:070:405",
// 	"01:070:406",
// 	"01:070:407",
// 	"01:070:408",
// 	"01:070:409",
// 	"01:070:410",
// 	"01:070:415",
// 	"01:070:417",
// 	"01:070:420",
// 	"01:070:422",
// 	"01:070:426",
// 	"01:070:486",
// 	"01:070:490",
// 	"01:070:491",
// 	"01:070:495",
// 	"01:070:496",
// 	"01:070:497",
// 	"01:070:498",
// 	"01:070:499",
// 	"01:070:EC",
// 	"01:070:EC1",
// 	"01:070:EC2",
// 	"01:070:MAJ",
// 	"01:070:NM",
// 	"01:070:302",
// 	"01:070:303",
// 	"01:070:304",
// 	"01:070:305",
// 	"01:070:306",
// 	"01:070:307",
// 	"01:070:308",
// 	"01:070:309",
// 	"01:070:311",
// 	"01:070:312",
// 	"01:070:313",
// 	"01:070:314",
// 	"01:070:316",
// 	"01:070:317",
// 	"01:070:318",
// 	"01:070:319",
// 	"01:070:320",
// 	"01:070:321",
// 	"01:070:322",
// 	"01:070:323",
// 	"01:070:324",
// 	"01:070:325",
// 	"01:070:326",
// 	"01:070:327",
// 	"01:070:328",
// 	"01:070:329",
// 	"01:070:330",
// 	"01:070:331",
// 	"01:070:332",
// 	"01:070:333",
// 	"01:070:334",
// 	"01:070:335",
// 	"01:070:336",
// 	"01:070:337",
// 	"01:070:338",
// 	"01:070:339",
// 	"01:070:340",
// 	"01:070:341",
// 	"01:070:342",
// 	"01:070:343",
// 	"01:070:344",
// 	"01:070:345",
// 	"01:070:346",
// 	"01:070:347",
// 	"01:070:348",
// 	"01:070:349",
// 	"01:070:350",
// 	"01:070:351",
// 	"01:070:352",
// 	"01:070:354",
// 	"01:070:355",
// 	"01:070:356",
// 	"01:070:357",
// 	"01:070:358",
// 	"01:070:359",
// 	"01:070:360",
// 	"01:070:361",
// 	"01:070:362",
// 	"01:070:363",
// 	"01:070:365",
// 	"01:070:367",
// 	"01:070:368",
// 	"01:070:369",
// 	"01:070:370",
// 	"01:070:371",
// 	"01:070:372",
// 	"01:070:373",
// 	"01:070:374",
// 	"01:070:375",
// 	"01:070:376",
// 	"01:070:377",
// 	"01:070:378",
// 	"01:070:379",
// 	"01:070:380",
// 	"01:070:381",
// 	"01:070:382",
// 	"01:070:383",
// 	"01:070:384",
// 	"01:070:385",
// 	"01:070:386",
// 	"01:070:387",
// 	"01:070:388",
// 	"01:070:389",
// 	"01:070:390",
// 	"01:070:391",
// 	"01:070:392",
// 	"01:070:393",
// 	"01:070:394",
// 	"01:070:395",
// 	"01:070:396",
// 	"01:070:397",
// 	"01:070:398",
// 	"01:070:401",
// 	"01:070:402",
// 	"01:070:403",
// 	"01:070:404",
// 	"01:070:405",
// 	"01:070:406",
// 	"01:070:407",
// 	"01:070:408",
// 	"01:070:409",
// 	"01:070:410",
// 	"01:070:415",
// 	"01:070:417",
// 	"01:070:420",
// 	"01:070:422",
// 	"01:070:426",
// 	"01:070:486",
// 	"01:070:490",
// 	"01:070:491",
// 	"01:070:495",
// 	"01:070:496",
// 	"01:070:497",
// 	"01:070:498",
// 	"01:070:499"
// ]);

// const joinedString = [...a].map(item => `"${item}"`).join(", ");
// joinedString;

// res = [
// 	"Gender and Media",
// 	"African Area Studies",
// 	"Africana Studies",
// 	"American Studies",
// 	"Anthropology - Cultural",
// 	"Anthropology - Evolutionary",
// 	"Anthropology - General",
// 	"Arabic",
// 	"Art History",
// 	"Biological Sciences",
// 	"Asian Studies",
// 	"Business and Technical Writing",
// 	"Chinese",
// 	"Cinema Studies",
// 	"Classical Humanities",
// 	"Cognitive Science",
// 	"Comparative and Critical Race and Ethnic Studies",
// 	"Comparative Literature",
// 	"Computer Science",
// 	"Creative Writing",
// 	"Criminology",
// 	"Critical Intelligence Studies",
// 	"Sexualities Studies",
// 	"Quantitative Economics",
// 	"English",
// 	"European Studies",
// 	"Sport Management",
// 	"French",
// 	"Geography",
// 	"Earth and Planetary Sciences - Geological Sciences",
// 	"German",
// 	"Greek - Ancient",
// 	"Greek - Modern",
// 	"Health and Society",
// 	"Hindi",
// 	"History",
// 	"Hungarian",
// 	"International and Global Studies",
// 	"Italian",
// 	"Japanese",
// 	"Jewish Studies",
// 	"Korean",
// 	"Language and Culture of Ancient Israel",
// 	"Latin",
// 	"Latin American Studies",
// 	"Latino and Caribbean Studies",
// 	"Linguistics",
// 	"Mathematics",
// 	"Medieval Studies",
// 	"Middle Eastern Studies",
// 	"Organizational Leadership",
// 	"Philosophy",
// 	"Physics",
// 	"Political Science",
// 	"Portuguese",
// 	"Developmental Psychology",
// 	"Religion",
// 	"Russian",
// 	"Social Justice",
// 	"Sociology",
// 	"South Asian Studies",
// 	"Spanish",
// 	"Statistics",
// 	"Women’s, Gender, and Sexuality Studies",
// 	"African, Middle Eastern & South Asian Languages & Literatures",
// 	"Chemistry",
// 	"African Languages",
// 	"Persian",
// 	"Turkish",
// 	"Chemistry Education",
// 	"Philosophy, Politics, and Economics (PPE)",
// 	"History - STEM in Society",
// 	"Psychology",
// 	"Military Science- Military Science Track",
// 	"Military Science- Naval Science Track",
// 	"Military Science- Aerospace Science Track",
// 	"Military Science- Non-commissioning",
// 	"History - Law and History",
// 	"Archaeology",
// 	"Astrobiology",
// 	"Holocaust Studies",
// 	"Economics",
// 	"Architectural Studies",
// 	"Astronomy",
// 	"Data Science",
// 	"Government and Business",
// 	"Asian American Studies",
// 	"Environmental Studies",
// 	"Slavic and Eastern European Studies"
// ];

let res = [
	"01:050:102",
	"01:050:200",
	"01:050:201",
	"01:050:202",
	"01:050:203",
	"01:050:204",
	"01:050:210",
	"01:050:215",
	"01:050:216",
	"01:050:218",
	"01:050:223",
	"01:050:228",
	"01:050:230",
	"01:050:240",
	"01:050:242",
	"01:050:244",
	"01:050:245",
	"01:050:246",
	"01:050:247",
	"01:050:248",
	"01:050:250",
	"01:050:253",
	"01:050:259",
	"01:050:260",
	"01:050:261",
	"01:050:262",
	"01:050:263",
	"01:050:264",
	"01:050:265",
	"01:050:266",
	"01:050:267",
	"01:050:268",
	"01:050:269",
	"01:050:271",
	"01:050:272",
	"01:050:281",
	"01:050:282",
	"01:050:283",
	"01:050:284",
	"01:050:285",
	"01:050:286",
	"01:050:291",
	"01:050:292",
	"01:050:295",
	"01:050:300",
	"01:050:301",
	"01:050:302",
	"01:050:303",
	"01:050:304",
	"01:050:305",
	"01:050:306",
	"01:050:307",
	"01:050:308",
	"01:050:309",
	"01:050:311",
	"01:050:312",
	"01:050:313",
	"01:050:314",
	"01:050:315",
	"01:050:316",
	"01:050:317",
	"01:050:318",
	"01:050:320",
	"01:050:321",
	"01:050:322",
	"01:050:323",
	"01:050:324",
	"01:050:325",
	"01:050:326",
	"01:050:327",
	"01:050:329",
	"01:050:330",
	"01:050:331",
	"01:050:332",
	"01:050:333",
	"01:050:335",
	"01:050:336",
	"01:050:337",
	"01:050:340",
	"01:050:341",
	"01:050:342",
	"01:050:344",
	"01:050:350",
	"01:050:351",
	"01:050:353",
	"01:050:355",
	"01:050:357",
	"01:050:359",
	"01:050:365",
	"01:050:366",
	"01:050:370",
	"01:050:371",
	"01:050:376",
	"01:050:377",
	"01:050:380",
	"01:050:381",
	"01:050:390",
	"01:050:391",
	"01:050:400",
	"01:050:401",
	"01:050:449",
	"01:050:450",
	"01:050:455",
	"01:050:465",
	"01:050:490",
	"01:050:491",
	"01:050:495",
	"01:050:496",
	"01:050:MAJ",
	"01:050:NM",
	"01:050:300",
	"01:050:301",
	"01:050:302",
	"01:050:303",
	"01:050:304",
	"01:050:305",
	"01:050:306",
	"01:050:307",
	"01:050:308",
	"01:050:309",
	"01:050:311",
	"01:050:312",
	"01:050:313",
	"01:050:314",
	"01:050:315",
	"01:050:316",
	"01:050:317",
	"01:050:318",
	"01:050:320",
	"01:050:321",
	"01:050:322",
	"01:050:323",
	"01:050:324",
	"01:050:325",
	"01:050:326",
	"01:050:327",
	"01:050:329",
	"01:050:330",
	"01:050:331",
	"01:050:332",
	"01:050:333",
	"01:050:335",
	"01:050:336",
	"01:050:337",
	"01:050:340",
	"01:050:341",
	"01:050:342",
	"01:050:344",
	"01:050:350",
	"01:050:351",
	"01:050:353",
	"01:050:355",
	"01:050:357",
	"01:050:359",
	"01:050:365",
	"01:050:366",
	"01:050:370",
	"01:050:371",
	"01:050:376",
	"01:050:377",
	"01:050:380",
	"01:050:381",
	"01:050:390",
	"01:050:391",
	"01:050:400",
	"01:050:401",
	"01:050:449",
	"01:050:450",
	"01:050:455",
	"01:050:465",
	"01:050:490",
	"01:050:491",
	"01:050:495",
	"01:050:496"
];

res.sort(); // Sort the array
res = [...new Set(res)]; // Remove duplicates efficiently
res.forEach(e => console.log(e)); // Print each element
