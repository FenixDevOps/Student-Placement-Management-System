-- Pre-seed data for Student Placement Management System

-- Seed Admin (password is BCrypt hash of 'admin123')
INSERT INTO admins (username, password)
VALUES ('admin', '$2a$10$3z7bKkRz7yqN2T69u4kRru8d4W0P9H1l5e.FhS46W4lH21jW9yT6G');

-- Seed Students (password is BCrypt hash of 'password123')
INSERT INTO students (name, email, password, phone, cgpa, branch, graduation_year, skills, resume_url)
VALUES 
('Rajesh Kumar', 'rajesh.kumar@university.edu', '$2a$10$K9Wn0qGq4uQZfE3dO1f4uOfY7eU7pT86v.w9WvB5eE0Jm1cE34e2G', '+91 9876543210', 8.50, 'CSE', 2026, 'Java, Spring Boot, React, SQL', NULL),
('Sneha Sharma', 'sneha.sharma@university.edu', '$2a$10$K9Wn0qGq4uQZfE3dO1f4uOfY7eU7pT86v.w9WvB5eE0Jm1cE34e2G', '+91 9876543211', 9.20, 'CSE', 2026, 'Python, Django, Machine Learning, AWS', NULL),
('Amit Patel', 'amit.patel@university.edu', '$2a$10$K9Wn0qGq4uQZfE3dO1f4uOfY7eU7pT86v.w9WvB5eE0Jm1cE34e2G', '+91 9876543212', 7.80, 'ECE', 2026, 'C++, Embedded Systems, IoT', NULL),
('Priya Nair', 'priya.nair@university.edu', '$2a$10$K9Wn0qGq4uQZfE3dO1f4uOfY7eU7pT86v.w9WvB5eE0Jm1cE34e2G', '+91 9876543213', 6.50, 'ME', 2026, 'AutoCAD, SolidWorks, MATLAB', NULL),
('Vikram Singh', 'vikram.singh@university.edu', '$2a$10$K9Wn0qGq4uQZfE3dO1f4uOfY7eU7pT86v.w9WvB5eE0Jm1cE34e2G', '+91 9876543214', 8.90, 'IT', 2026, 'JavaScript, Node.js, Express, MongoDB', NULL);

-- Seed Companies
INSERT INTO companies (company_name, role, package, eligibility_criteria, description, last_date)
VALUES 
('Google', 'Software Engineer I', 32.50, 8.00, 'Develop next-generation technologies that change how billions of users connect, explore, and interact with information. Strong problem-solving, algorithms, and system design skills required.', CURRENT_DATE + INTERVAL '7 days'),
('Microsoft', 'Software Engineer', 28.00, 8.00, 'Empower every person and every organization on the planet to achieve more. Join our Azure development or Office engineering groups.', CURRENT_DATE + INTERVAL '12 days'),
('TCS', 'Systems Engineer (Ninja/Digital)', 7.00, 6.00, 'Tata Consultancy Services is a global leader in IT services, consulting & business solutions. Experience with core programming concepts required.', CURRENT_DATE + INTERVAL '5 days'),
('Amazon', 'Support Engineer', 16.00, 7.00, 'Provide technical support to customers using Amazon Web Services. Work on automating cloud tasks, shell scripting, and debugging networking problems.', CURRENT_DATE - INTERVAL '1 days'),
('Meta', 'Product Engineer', 38.00, 8.50, 'Build the future of social connection. Work on infrastructure scale, machine learning delivery systems, and user interfaces.', CURRENT_DATE + INTERVAL '12 days'),
('Netflix', 'Senior UI Engineer', 42.00, 8.00, 'Deliver video entertainment content globally. Design and optimize high performance React browser rendering engines.', CURRENT_DATE + INTERVAL '14 days'),
('Apple', 'iOS Developer', 30.00, 8.20, 'Design innovative apps for iOS, iPadOS, macOS, and watchOS. Requires strong Swift and Objective-C proficiency.', CURRENT_DATE + INTERVAL '18 days'),
('Adobe', 'Computer Scientist', 25.00, 8.00, 'Develop core graphics modules for digital media products. Strong background in C++, image processing, and algorithms.', CURRENT_DATE + INTERVAL '20 days'),
('Uber', 'Backend Engineer', 29.50, 7.50, 'Architect reliable distributed routing engines matching millions of riders. Strong Go, Java, or C++ background.', CURRENT_DATE + INTERVAL '8 days'),
('Airbnb', 'Fullstack Developer', 27.00, 7.80, 'Create robust online marketplace travel reservation portals. Requires React, Node.js, and schema scaling experience.', CURRENT_DATE + INTERVAL '9 days'),
('Salesforce', 'Member of Technical Staff', 22.00, 7.50, 'Build enterprise CRM cloud systems. Experience with multi-tenant architectures and microservices required.', CURRENT_DATE + INTERVAL '16 days'),
('NVIDIA', 'Deep Learning Engineer', 35.00, 8.50, 'Develop AI algorithms for autonomous driving and graphics processing. Strong CUDA, PyTorch, and math skills.', CURRENT_DATE + INTERVAL '22 days'),
('Oracle', 'Cloud Developer', 18.00, 7.00, 'Build highly secure cloud database infrastructure. Work on database kernels and distributed system configurations.', CURRENT_DATE + INTERVAL '25 days'),
('Intel', 'Silicon Validation Engineer', 16.50, 7.20, 'Verify logic designs for next-generation hardware microchips. Work on system-on-chip architectures and RTL design.', CURRENT_DATE + INTERVAL '5 days'),
('Qualcomm', 'Embedded Software Engineer', 19.00, 7.50, 'Write firmware code for mobile wireless cellular network modems. Experience in RTOS and C/C++ required.', CURRENT_DATE + INTERVAL '6 days'),
('Cisco', 'Network Engineer', 15.00, 7.00, 'Build networking firewalls and routing switch operating systems. Experience with TCP/IP and routing protocols.', CURRENT_DATE + INTERVAL '11 days'),
('Stripe', 'Payments Engineer', 33.00, 8.00, 'Architect secure global online financial payment gateways. Focus on reliability, transaction consistency, and API designs.', CURRENT_DATE + INTERVAL '17 days'),
('Atlassian', 'Graduate Software Engineer', 26.00, 8.00, 'Help build Jira and Confluence workflow software. Experience in collaborative Git workflows and fullstack Java/React.', CURRENT_DATE + INTERVAL '13 days'),
('Goldman Sachs', 'Financial Technology Analyst', 24.00, 8.00, 'Design algorithmic trading systems and risk management platforms. Experience with Java concurrency and SQL.', CURRENT_DATE + INTERVAL '10 days'),
('JPMorgan Chase', 'Software Engineer', 14.50, 7.00, 'Build consumer banking mobile apps and payment APIs. Focus on clean code, REST web services, and unit testing.', CURRENT_DATE + INTERVAL '19 days'),
('Morgan Stanley', 'Technology Associate', 16.00, 7.20, 'Develop portfolio management analytics software. Strong communication and core analytical problem-solving skills.', CURRENT_DATE + INTERVAL '21 days'),
('Walmart Global Tech', 'Software Engineer', 20.00, 7.50, 'Scale global e-commerce supply chain logistics software. Work on microservices, Cassandra, and Kafka pipelines.', CURRENT_DATE + INTERVAL '23 days'),
('Intuit', 'Software Engineer', 23.50, 7.80, 'Build financial accounting software (TurboTax/QuickBooks). Focus on user experience, API gateways, and AWS cloud tools.', CURRENT_DATE + INTERVAL '24 days'),
('ServiceNow', 'Software Quality Engineer', 17.00, 7.00, 'Develop automation testing frameworks for cloud workflows. Requires JavaScript and Selenium scripting.', CURRENT_DATE + INTERVAL '28 days'),
('Red Hat', 'Linux Systems Engineer', 15.50, 7.00, 'Contribute to open-source systems software and Linux kernel distributions. Expertise in C, Bash, and operating systems concepts required.', CURRENT_DATE + INTERVAL '26 days'),
('Databricks', 'Software Engineer, Data Platform', 34.00, 8.50, 'Design and optimize large-scale distributed analytics engines built on Apache Spark and Delta Lake.', CURRENT_DATE + INTERVAL '27 days'),
('Snowflake', 'Database Engine Developer', 32.00, 8.30, 'Build next-generation cloud database systems. Requires strong background in systems programming, C++, and SQL query execution engines.', CURRENT_DATE + INTERVAL '30 days'),
('HubSpot', 'Frontend Developer', 18.50, 7.00, 'Create delightful UI experiences for CRM tools. Experience in React, TypeScript, and modern CSS frameworks required.', CURRENT_DATE + INTERVAL '31 days'),
('Zoom', 'WebRTC Engineer', 22.00, 7.50, 'Optimize real-time audio and video communications. Experience in WebRTC, C++, and network protocols (UDP/TCP).', CURRENT_DATE + INTERVAL '32 days'),
('Slack', 'Product Engineer', 24.50, 7.80, 'Build conversational collaboration tools. Work on scale challenges, UI components, and real-time messaging pipelines.', CURRENT_DATE + INTERVAL '33 days'),
('Splunk', 'Security Developer', 21.00, 7.50, 'Develop security operations and log analysis software. Strong knowledge of cybersecurity, network logs, and backend Java/Go.', CURRENT_DATE + INTERVAL '34 days'),
('Twilio', 'API Engineer', 19.50, 7.20, 'Build cloud communications APIs for voice, SMS, and email. Focus on building clean developer interfaces and highly available microservices.', CURRENT_DATE + INTERVAL '35 days'),
-- Additional 20 companies with different roles
('Spotify', 'Audio Processing Engineer', 25.00, 7.50, 'Work on audio compression codecs and recommendation feeds.', CURRENT_DATE + INTERVAL '12 days'),
('Square', 'POS SDK Developer', 23.00, 7.00, 'Build mobile hardware reader interfaces and SDK integrations.', CURRENT_DATE + INTERVAL '15 days'),
('Figma', 'WebGL Graphics Developer', 32.00, 8.20, 'Optimize interactive browser-based vector design platforms.', CURRENT_DATE + INTERVAL '10 days'),
('Snapchat', 'AR Lens Creator Engine', 27.00, 7.80, 'Develop real-time computer vision face mesh tracking features.', CURRENT_DATE + INTERVAL '14 days'),
('Pinterest', 'Search & Ranking Architect', 26.50, 8.00, 'Optimize text embedding models and multi-modal pin boards.', CURRENT_DATE + INTERVAL '19 days'),
('DoorDash', 'Courier Matching Lead', 28.00, 7.50, 'Scale dispatch algorithms and dynamic pricing routers.', CURRENT_DATE + INTERVAL '21 days'),
('Asana', 'Collaboration System Engineer', 20.00, 7.00, 'Scale real-time web socket state synchronization services.', CURRENT_DATE + INTERVAL '18 days'),
('GitHub', 'Actions Platform Developer', 24.00, 7.80, 'Optimize runner virtualization and parallel build environments.', CURRENT_DATE + INTERVAL '22 days'),
('GitLab', 'DevSecOps Specialist', 21.50, 7.20, 'Integrate static analyzers and package registry managers.', CURRENT_DATE + INTERVAL '16 days'),
('DigitalOcean', 'Kubernetes Cloud Dev', 17.50, 7.00, 'Maintain managed docker registry platforms and droplet APIs.', CURRENT_DATE + INTERVAL '11 days'),
('Cloudflare', 'Zero Trust Architect', 30.00, 8.00, 'Design fast proxy security access networks at the edge.', CURRENT_DATE + INTERVAL '25 days'),
('Heroku', 'Buildpack Developer', 19.00, 7.00, 'Develop standard compilation scripts for node/python pipelines.', CURRENT_DATE + INTERVAL '23 days'),
('DocuSign', 'Cryptography Engineer', 22.00, 7.50, 'Maintain key signature chains and digital certificate vaults.', CURRENT_DATE + INTERVAL '24 days'),
('ZoomInfo', 'Lead Data Harvester', 18.00, 7.00, 'Optimize web scraping queues and firmographic database records.', CURRENT_DATE + INTERVAL '20 days'),
('Box', 'Content Sync Engineer', 19.50, 7.20, 'Scale lockless local folder synchronization applications.', CURRENT_DATE + INTERVAL '27 days'),
('Dropbox', 'Block Storage Engineer', 26.00, 8.00, 'Build low latency cloud storage cluster protocols.', CURRENT_DATE + INTERVAL '29 days'),
('Canva', 'Print Pipeline Lead', 21.00, 7.20, 'Create high resolution PDF exporting converters.', CURRENT_DATE + INTERVAL '28 days'),
('Shopify', 'Liquid Template Optimizer', 22.50, 7.50, 'Optimize server-side HTML rendering engines.', CURRENT_DATE + INTERVAL '30 days'),
('Postman', 'API client Optimizer', 18.50, 7.00, 'Enhance performance of REST/gRPC client runtime environments.', CURRENT_DATE + INTERVAL '31 days'),
('Wix', 'CSS Layout Engine Dev', 16.00, 7.00, 'Build responsive layout algorithms for website builders.', CURRENT_DATE + INTERVAL '32 days');

-- Seed Applications
INSERT INTO applications (student_id, company_id, status, match_score, application_date)
VALUES 
(1, 1, 'SHORTLISTED', 82, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(1, 2, 'APPLIED', 75, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(2, 1, 'SELECTED', 95, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(2, 2, 'INTERVIEW_SCHEDULED', 88, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(3, 3, 'APPLIED', 60, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 3, 'REJECTED', 35, CURRENT_TIMESTAMP - INTERVAL '8 days');

-- Seed Interviews
INSERT INTO interviews (application_id, scheduled_time, duration_minutes, round_name, location_or_link, notes)
VALUES
(1, CURRENT_TIMESTAMP + INTERVAL '3 days', 60, 'Technical Round 1', 'https://meet.google.com/abc-defg-hij', 'Focus on algorithms and data structures. Prepare LC medium-hard level.'),
(2, CURRENT_TIMESTAMP + INTERVAL '5 days', 45, 'Aptitude Test', 'Room 301, Placement Cell Building', 'Quantitative aptitude and logical reasoning. Bring calculator.'),
(3, CURRENT_TIMESTAMP + INTERVAL '2 days', 30, 'HR Round', 'https://teams.microsoft.com/l/meetup/xyz', 'Final HR discussion. Salary negotiation may happen.'),
(4, CURRENT_TIMESTAMP + INTERVAL '7 days', 90, 'Technical Round 2', 'https://zoom.us/j/123456789', 'System design round. Prepare distributed systems concepts.');

-- Seed Forum Posts
INSERT INTO forum_posts (student_id, title, content, category, is_anonymous, created_at)
VALUES
(1, 'My Google Interview Experience - SDE I (2026)', 'I recently interviewed for the Software Engineer I position at Google. The process consisted of 4 rounds: 1 phone screen + 3 onsite rounds (2 coding + 1 system design). The coding rounds focused heavily on graph algorithms and dynamic programming. For preparation, I recommend LeetCode premium and the System Design Primer on GitHub. The interviewers were very friendly and gave hints when I was stuck.', 'Interview Experience', false, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 'Best Resources for DSA Preparation', 'After getting selected at Google, here are my top resources: 1) Striver SDE Sheet - covers all important patterns 2) NeetCode 150 - great for pattern recognition 3) CLRS Book - for deep understanding 4) Mock interviews on Pramp. Start at least 4 months before placement season.', 'Prep Material', false, CURRENT_TIMESTAMP - INTERVAL '1 days'),
(NULL, 'Is 7.5 CGPA enough for product companies?', 'I have a 7.5 CGPA and I am worried about not clearing the eligibility criteria for top product companies. Can someone share the cutoffs for companies like Google, Microsoft, and Amazon from last year placement drive?', 'General', true, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 'TCS Digital Interview Pattern 2026', 'TCS Digital interview has changed this year. They now include a coding round on TCS CodeVita platform followed by a technical interview and HR. The coding questions were of medium difficulty focusing on arrays, strings, and basic DP. Salary package is 7 LPA for Ninja and 9 LPA for Digital.', 'Interview Experience', false, CURRENT_TIMESTAMP);

-- Seed Forum Comments
INSERT INTO forum_comments (post_id, student_id, content, is_anonymous, created_at)
VALUES
(1, 2, 'Great write-up Rajesh! Did they ask any behavioral questions during the onsite rounds?', false, CURRENT_TIMESTAMP - INTERVAL '1 days'),
(1, NULL, 'How long did the entire process take from application to offer?', true, CURRENT_TIMESTAMP - INTERVAL '12 hours'),
(2, 3, 'Thanks Sneha! The Striver SDE sheet is amazing. I completed it in 3 months and it really helped.', false, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
(3, 1, 'Most product companies have a cutoff of 7.0 or above. With 7.5 you should be fine for Amazon, Microsoft, and many others. Google typically requires 8.0+.', false, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 5, 'Thanks for sharing! Did you face any questions on system design in TCS Digital?', false, CURRENT_TIMESTAMP - INTERVAL '1 hours');
