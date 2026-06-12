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
('Google', 'Software Engineer I', 32.50, 8.00, 'Develop next-generation technologies that change how billions of users connect, explore, and interact with information. Strong problem-solving, algorithms, and system design skills required.', '2026-06-20'),
('Microsoft', 'Software Engineer', 28.00, 8.00, 'Empower every person and every organization on the planet to achieve more. Join our Azure development or Office engineering groups.', '2026-06-25'),
('TCS', 'Systems Engineer (Ninja/Digital)', 7.00, 6.00, 'Tata Consultancy Services is a global leader in IT services, consulting & business solutions. Experience with core programming concepts required.', '2026-06-18'),
('Amazon', 'Support Engineer', 16.00, 7.00, 'Provide technical support to customers using Amazon Web Services. Work on automating cloud tasks, shell scripting, and debugging networking problems.', '2026-05-31'),
('Meta', 'Product Engineer', 38.00, 8.50, 'Build the future of social connection. Work on infrastructure scale, machine learning delivery systems, and user interfaces.', '2026-12-31'),
('Netflix', 'Senior UI Engineer', 42.00, 8.00, 'Deliver video entertainment content globally. Design and optimize high performance React browser rendering engines.', '2026-12-31'),
('Apple', 'iOS Developer', 30.00, 8.20, 'Design innovative apps for iOS, iPadOS, macOS, and watchOS. Requires strong Swift and Objective-C proficiency.', '2026-12-31'),
('Adobe', 'Computer Scientist', 25.00, 8.00, 'Develop core graphics modules for digital media products. Strong background in C++, image processing, and algorithms.', '2026-12-31'),
('Uber', 'Backend Engineer', 29.50, 7.50, 'Architect reliable distributed routing engines matching millions of riders. Strong Go, Java, or C++ background.', '2026-12-31'),
('Airbnb', 'Fullstack Developer', 27.00, 7.80, 'Create robust online marketplace travel reservation portals. Requires React, Node.js, and schema scaling experience.', '2026-12-31'),
('Salesforce', 'Member of Technical Staff', 22.00, 7.50, 'Build enterprise CRM cloud systems. Experience with multi-tenant architectures and microservices required.', '2026-12-31'),
('NVIDIA', 'Deep Learning Engineer', 35.00, 8.50, 'Develop AI algorithms for autonomous driving and graphics processing. Strong CUDA, PyTorch, and math skills.', '2026-12-31'),
('Oracle', 'Cloud Developer', 18.00, 7.00, 'Build highly secure cloud database infrastructure. Work on database kernels and distributed system configurations.', '2026-12-31'),
('Intel', 'Silicon Validation Engineer', 16.50, 7.20, 'Verify logic designs for next-generation hardware microchips. Work on system-on-chip architectures and RTL design.', '2026-12-31'),
('Qualcomm', 'Embedded Software Engineer', 19.00, 7.50, 'Write firmware code for mobile wireless cellular network modems. Experience in RTOS and C/C++ required.', '2026-12-31'),
('Cisco', 'Network Engineer', 15.00, 7.00, 'Build networking firewalls and routing switch operating systems. Experience with TCP/IP and routing protocols.', '2026-12-31'),
('Stripe', 'Payments Engineer', 33.00, 8.00, 'Architect secure global online financial payment gateways. Focus on reliability, transaction consistency, and API designs.', '2026-12-31'),
('Atlassian', 'Graduate Software Engineer', 26.00, 8.00, 'Help build Jira and Confluence workflow software. Experience in collaborative Git workflows and fullstack Java/React.', '2026-12-31'),
('Goldman Sachs', 'Financial Technology Analyst', 24.00, 8.00, 'Design algorithmic trading systems and risk management platforms. Experience with Java concurrency and SQL.', '2026-12-31'),
('JPMorgan Chase', 'Software Engineer', 14.50, 7.00, 'Build consumer banking mobile apps and payment APIs. Focus on clean code, REST web services, and unit testing.', '2026-12-31'),
('Morgan Stanley', 'Technology Associate', 16.00, 7.20, 'Develop portfolio management analytics software. Strong communication and core analytical problem-solving skills.', '2026-12-31'),
('Walmart Global Tech', 'Software Engineer', 20.00, 7.50, 'Scale global e-commerce supply chain logistics software. Work on microservices, Cassandra, and Kafka pipelines.', '2026-12-31'),
('Intuit', 'Software Engineer', 23.50, 7.80, 'Build financial accounting software (TurboTax/QuickBooks). Focus on user experience, API gateways, and AWS cloud tools.', '2026-12-31'),
('ServiceNow', 'Software Quality Engineer', 17.00, 7.00, 'Develop automation testing frameworks for cloud workflows. Requires JavaScript and Selenium scripting.', '2026-12-31'),
('Red Hat', 'Linux Systems Engineer', 15.50, 7.00, 'Contribute to open-source systems software and Linux kernel distributions. Expertise in C, Bash, and operating systems concepts required.', '2026-12-31'),
('Databricks', 'Software Engineer, Data Platform', 34.00, 8.50, 'Design and optimize large-scale distributed analytics engines built on Apache Spark and Delta Lake.', '2026-12-31'),
('Snowflake', 'Database Engine Developer', 32.00, 8.30, 'Build next-generation cloud database systems. Requires strong background in systems programming, C++, and SQL query execution engines.', '2026-12-31'),
('HubSpot', 'Frontend Developer', 18.50, 7.00, 'Create delightful UI experiences for CRM tools. Experience in React, TypeScript, and modern CSS frameworks required.', '2026-12-31'),
('Zoom', 'WebRTC Engineer', 22.00, 7.50, 'Optimize real-time audio and video communications. Experience in WebRTC, C++, and network protocols (UDP/TCP).', '2026-12-31'),
('Slack', 'Product Engineer', 24.50, 7.80, 'Build conversational collaboration tools. Work on scale challenges, UI components, and real-time messaging pipelines.', '2026-12-31'),
('Splunk', 'Security Developer', 21.00, 7.50, 'Develop security operations and log analysis software. Strong knowledge of cybersecurity, network logs, and backend Java/Go.', '2026-12-31'),
('Twilio', 'API Engineer', 19.50, 7.20, 'Build cloud communications APIs for voice, SMS, and email. Focus on building clean developer interfaces and highly available microservices.', '2026-12-31'),
('Pinterest', 'Data Infrastructure Engineer', 28.00, 8.00, 'Scale high-throughput storage, search, and recommendation infrastructure serving millions of active users.', '2026-12-31'),
('Robinhood', 'Fintech Backend Engineer', 31.00, 8.20, 'Work on high-frequency transaction matching systems and financial Ledger architectures. Knowledge of Go and relational databases.', '2026-12-31'),
('Coinbase', 'Blockchain Developer', 29.00, 8.00, 'Develop secure smart contracts and crypto custody wallets. Deep understanding of cryptography and distributed ledger technology.', '2026-12-31'),
('Lyft', 'Data Scientist', 26.00, 7.80, 'Optimize dispatch algorithms and pricing strategies using machine learning models and large-scale GPS data pools.', '2026-12-31'),
('Palantir', 'Deployment Engineer', 30.50, 8.00, 'Deploy big data analytics platforms directly onto customer infrastructures. Requires systems architecture, Docker, and customer interaction.', '2026-12-31'),
('Tesla', 'Autopilot Software Engineer', 36.00, 8.50, 'Design autonomy systems and real-time computer vision models for self-driving cars. Exceptional C++ and deep learning experience required.', '2026-12-31'),
('SpaceX', 'Flight Software Engineer', 28.50, 8.30, 'Write code that controls spacecraft and rocket vehicles. Hard real-time C++ constraints, operating systems, and fault-tolerance design.', '2026-12-31'),
('CrowdStrike', 'Threat Research Developer', 27.50, 8.00, 'Build cybersecurity agent kernel drivers for threat detection. Requires low-level operating system internals, C, and assembly.', '2026-12-31'),
('Cloudflare', 'Edge Systems Engineer', 29.00, 8.00, 'Optimize global CDN caching and security protocols running at the edge. Experience with Rust, DNS, and HTTP/3 is a major plus.', '2026-12-31'),
('Elastic', 'Search Architect', 23.00, 7.50, 'Develop Lucene and Elasticsearch core search features. Experience with text analysis, database scaling, and Java concurrency.', '2026-12-31'),
('GitHub', 'Developer Relations Engineer', 18.00, 7.00, 'Improve developer developer experience and build tools/integrations. Strong community presence and web API experience.', '2026-12-31'),
('Shopify', 'E-commerce Platform Engineer', 25.00, 7.50, 'Scale rails-based checkout backends and React frontends to handle millions of simultaneous shoppers.', '2026-12-31');

-- Seed Applications (using simple mappings since IDs start at 1)
INSERT INTO applications (student_id, company_id, status, match_score, application_date)
VALUES 
(1, 1, 'SHORTLISTED', 82, CURRENT_TIMESTAMP),
(1, 2, 'APPLIED', 75, CURRENT_TIMESTAMP),
(2, 1, 'SELECTED', 95, CURRENT_TIMESTAMP),
(2, 2, 'INTERVIEW_SCHEDULED', 88, CURRENT_TIMESTAMP),
(3, 3, 'APPLIED', 60, CURRENT_TIMESTAMP),
(4, 3, 'REJECTED', 35, CURRENT_TIMESTAMP);

-- Seed Interviews
INSERT INTO interviews (application_id, scheduled_time, duration_minutes, round_name, location_or_link, notes)
VALUES
(1, DATEADD('DAY', 3, CURRENT_TIMESTAMP), 60, 'Technical Round 1', 'https://meet.google.com/abc-defg-hij', 'Focus on algorithms and data structures. Prepare LC medium-hard level.'),
(2, DATEADD('DAY', 5, CURRENT_TIMESTAMP), 45, 'Aptitude Test', 'Room 301, Placement Cell Building', 'Quantitative aptitude and logical reasoning. Bring calculator.'),
(3, DATEADD('DAY', 2, CURRENT_TIMESTAMP), 30, 'HR Round', 'https://teams.microsoft.com/l/meetup/xyz', 'Final HR discussion. Salary negotiation may happen.'),
(4, DATEADD('DAY', 7, CURRENT_TIMESTAMP), 90, 'Technical Round 2', 'https://zoom.us/j/123456789', 'System design round. Prepare distributed systems concepts.');

-- Seed Forum Posts
INSERT INTO forum_posts (student_id, title, content, category, is_anonymous, created_at)
VALUES
(1, 'My Google Interview Experience - SDE I (2026)', 'I recently interviewed for the Software Engineer I position at Google. The process consisted of 4 rounds: 1 phone screen + 3 onsite rounds (2 coding + 1 system design). The coding rounds focused heavily on graph algorithms and dynamic programming. For preparation, I recommend LeetCode premium and the System Design Primer on GitHub. The interviewers were very friendly and gave hints when I was stuck.', 'Interview Experience', false, DATEADD('DAY', -2, CURRENT_TIMESTAMP)),
(2, 'Best Resources for DSA Preparation', 'After getting selected at Google, here are my top resources: 1) Striver SDE Sheet - covers all important patterns 2) NeetCode 150 - great for pattern recognition 3) CLRS Book - for deep understanding 4) Mock interviews on Pramp. Start at least 4 months before placement season.', 'Prep Material', false, DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(NULL, 'Is 7.5 CGPA enough for product companies?', 'I have a 7.5 CGPA and I am worried about not clearing the eligibility criteria for top product companies. Can someone share the cutoffs for companies like Google, Microsoft, and Amazon from last year placement drive?', 'General', true, DATEADD('DAY', -3, CURRENT_TIMESTAMP)),
(3, 'TCS Digital Interview Pattern 2026', 'TCS Digital interview has changed this year. They now include a coding round on TCS CodeVita platform followed by a technical interview and HR. The coding questions were of medium difficulty focusing on arrays, strings, and basic DP. Salary package is 7 LPA for Ninja and 9 LPA for Digital.', 'Interview Experience', false, CURRENT_TIMESTAMP);

-- Seed Forum Comments
INSERT INTO forum_comments (post_id, student_id, content, is_anonymous, created_at)
VALUES
(1, 2, 'Great write-up Rajesh! Did they ask any behavioral questions during the onsite rounds?', false, DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(1, NULL, 'How long did the entire process take from application to offer?', true, DATEADD('HOUR', -12, CURRENT_TIMESTAMP)),
(2, 3, 'Thanks Sneha! The Striver SDE sheet is amazing. I completed it in 3 months and it really helped.', false, DATEADD('HOUR', -6, CURRENT_TIMESTAMP)),
(3, 1, 'Most product companies have a cutoff of 7.0 or above. With 7.5 you should be fine for Amazon, Microsoft, and many others. Google typically requires 8.0+.', false, DATEADD('DAY', -2, CURRENT_TIMESTAMP)),
(4, 5, 'Thanks for sharing! Did you face any questions on system design in TCS Digital?', false, DATEADD('HOUR', -1, CURRENT_TIMESTAMP));
