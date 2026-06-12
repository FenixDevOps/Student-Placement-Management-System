# Student Placement Management System

A production-ready, full-stack placement portal designed to streamline campus recruitment. It connects university students, corporate recruiters, and placement officers on a centralized platform.

---

## Technical Architecture & Tech Stack

### Backend
* **Framework:** Java Spring Boot 3.3.0
* **Security:** Spring Security 6 with stateless sessions, JWT Authentication, and BCrypt password encryption.
* **ORM / Database Access:** Spring Data JPA with PostgreSQL Hikari connection pooling.
* **AWS Integration:** AWS S3 SDK v2 for PDF resume uploads, supporting a fallback local directory upload scheme when AWS variables are absent.
* **Reporting:** OpenPDF (open-source LGPL compiler) for server-side placement reports generation as PDF.
* **API Documentation:** OpenAPI / Swagger UI.

### Frontend
* **Core:** React 18, Vite, TypeScript
* **Routing:** React Router v6 (protected routes with role-based routing guards)
* **API Client:** Axios (automatic request interceptors injecting JWT Bearer authorization header)
* **Component UI Library:** Material UI (MUI v5)
* **Analytics Visualizations:** Recharts (interactive dashboards rendering branch charts and recruitment trends)

---

## Repository Structure

```text
Student Placement Management System/
│
├── database/
│   ├── schema.sql              # Database schema definitions (DDL)
│   └── data.sql                # Seed script with test accounts & drives
│
├── backend/
│   ├── pom.xml                 # Maven configuration and dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/placement/system/
│   │   │   │   ├── config/      # SecurityConfig, JWT, WebMvc, OpenApi
│   │   │   │   ├── controller/  # Rest endpoints (Auth, Students, Companies, etc.)
│   │   │   │   ├── dto/         # Request & Response Data Transfer Objects
│   │   │   │   ├── exception/   # Custom errors & GlobalException handlers
│   │   │   │   ├── model/       # JPA Entities (Student, Admin, Company, App)
│   │   │   │   ├── repository/  # Database repositories (Query execution)
│   │   │   │   └── service/     # Core logic (S3 upload, PDF reports, eligibility)
│   │   │   └── resources/
│   │   │       └── application.properties # Server configs, mail configs
│   │   └── test/
│   │       └── java/com/placement/system/service/ # Mockito unit tests
│   └── uploads/resumes/        # Local fallback resume file uploads folder
│
└── frontend/
    ├── index.html              # Entry HTML template
    ├── package.json            # Node scripts and dependencies list
    ├── vite.config.ts          # Vite configuration
    └── src/
        ├── App.tsx             # Theme, Context Providers, and Routes Mapping
        ├── main.tsx            # DOM mounting entry
        ├── index.css           # Global typography and animations
        ├── components/         # Sidebar, Navbar, ProtectedRoute, StatCard
        ├── context/            # AuthContext, ThemeContext
        ├── services/           # api.ts (Axios wrapper with interceptors)
        └── pages/              # Portal pages (Student/Admin dashboards, lists)
```

---

## Database Configuration (PostgreSQL)

Before running the application, set up your PostgreSQL database.

1. Connect to your PostgreSQL server and create a database named `placement_db`:
   ```sql
   CREATE DATABASE placement_db;
   ```
2. Run the SQL statements inside `database/schema.sql` to configure the tables.
3. Run `database/data.sql` to seed test admin, student profiles, and companies.

### Seed Test Accounts & Login Credentials:
* **Administrator:**
  * **Username:** `admin`
  * **Password:** `admin123`
* **Students:**
  * **Email:** `rajesh.kumar@university.edu` or `sneha.sharma@university.edu`
  * **Password:** `password123`

---

## Local Setup & Run Guide

### Running Backend (Spring Boot)
1. Ensure Java JDK 17 (or newer) is installed and available on your PATH.
2. Ensure PostgreSQL is active on port `5432` with username `postgres` and password `postgres`.
3. Open a terminal inside the `backend/` directory:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   * *If Maven is not installed globally, download Maven Wrapper or run using your IDE (IntelliJ, Eclipse, VS Code).*
4. Once the server boots, verify API availability:
   * **Swagger UI Documentation Panel:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   * **Base API Path:** [http://localhost:8080](http://localhost:8080)

### Running Frontend (React + TypeScript)
1. Ensure Node.js (v18+) is installed.
2. Open a terminal inside the `frontend/` directory and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open your browser and navigate to the port displayed in the console (default: [http://localhost:5173](http://localhost:5173)).

---

## REST API Documentation

### 1. Authentication Module
* **POST `/api/auth/register` (Public)**
  * Registers a student.
  * Request Body: `RegisterRequest` (name, email, password, phone, cgpa, branch, graduationYear, skills).
* **POST `/api/auth/login` (Public)**
  * universal login portal.
  * Request Body: `LoginRequest` (username, password).
  * Response: Returns JWT token string and role (`STUDENT` or `ADMIN`).

### 2. Student Module
* **GET `/api/students` (Admin Only)**
  * Returns paginated and filtered list of enrolled students.
* **GET `/api/students/{id}` (Admin or Student owner)**
  * Retrieves student profile configurations.
* **PUT `/api/students/{id}` (Student owner)**
  * Updates profile fields.
* **POST `/api/students/{id}/resume` (Student owner)**
  * Uploads PDF resume file (`multipart/form-data`).

### 3. Recruiter Company Module
* **GET `/api/companies` (Authenticated)**
  * Returns paginated active recruiters drives.
* **POST `/api/companies` (Admin Only)**
  * Adds new recruiter job drive opportunity.
* **PUT `/api/companies/{id}` (Admin Only)**
  * Modifies drive CTC, criteria, or deadline.
* **DELETE `/api/companies/{id}` (Admin Only)**
  * Cancels the recruitment drive.

### 4. Applications Module
* **POST `/api/applications` (Student Only)**
  * Submit job application. Verifies CGPA eligibility, deadline dates, and S3 resume URLs.
  * Request Body: `{ "studentId": 1, "companyId": 3 }`
* **GET `/api/applications/student/{id}` (Student owner or Admin)**
  * List applications submitted by a student.
* **GET `/api/applications` (Admin Only)**
  * List all applications submitted across all drives.
* **PUT `/api/applications/status/{id}` (Admin Only)**
  * Updates candidate status. Triggers email updates.
  * Request Body: `{ "status": "SHORTLISTED" }` (APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, SELECTED, REJECTED).

### 5. Statistics & PDF Reports
* **GET `/api/stats` (Authenticated)**
  * Aggregated placement ratios, averages, and charts lists.
* **GET `/api/reports/download` (Admin Only)**
  * Streams executive placements PDF report file.

---

## Cloud Deployment Guide (AWS)

### 1. AWS RDS PostgreSQL Database Setup
1. Log in to the AWS Management Console and open the **RDS** page.
2. Click **Create database** and select **PostgreSQL**.
3. Choose **Free Tier** template (for testing). Set DB Instance Identifier, Master username (e.g. `postgres`), and Password.
4. Set **Publicly Accessible** to "Yes" (if testing locally) or configure security groups to allow traffic from your EC2 instance.
5. Once active, retrieve the **Endpoint** domain. Set these values in your EC2 environment:
   ```bash
   export DB_HOST="your-rds-endpoint.amazonaws.com"
   export DB_PORT="5432"
   export DB_NAME="placement_db"
   export DB_USER="postgres"
   export DB_PASSWORD="yourpassword"
   ```

### 2. AWS S3 Bucket Setup (Resume PDF Storage)
1. Open the **S3** Console and click **Create bucket**. Provide a unique name.
2. Under Object Ownership, choose **ACLs enabled** or keep disabled.
3. Block all public access should be enabled for secure private downloads, or disabled if direct HTTP URLs are generated for recruiters (the S3Service uses direct URL links; if private, secure pre-signed URLs can be added).
4. Create an IAM User on AWS, assign policies for `AmazonS3FullAccess`, and retrieve **Access Key ID** and **Secret Access Key**. Set variables:
   ```bash
   export AWS_S3_BUCKET="your-bucket-name"
   export AWS_REGION="us-east-1"
   export AWS_ACCESS_KEY_ID="youraccesskey"
   export AWS_SECRET_ACCESS_KEY="yoursecretkey"
   ```

### 3. AWS EC2 Backend Deployment
1. Launch an AWS EC2 instance running Ubuntu Server (e.g., `t2.micro` free-tier).
2. Attach a Security Group mapping ports `22` (SSH), `80` (HTTP), and `8080` (Backend API).
3. Connect to your instance via SSH:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```
4. Install OpenJDK Java Runtime on EC2:
   ```bash
   sudo apt update
   sudo apt install openjdk-17-jre -y
   ```
5. Compile your Spring Boot project on your local developer machine:
   ```bash
   mvn clean package -DskipTests
   ```
6. Copy the generated `.jar` file to your EC2 instance (e.g., using SCP):
   ```bash
   scp -i your-key.pem backend/target/system-0.0.1-SNAPSHOT.jar ubuntu@your-ec2-ip:~/app.jar
   ```
7. Configure systemd service on EC2 to run the app in background:
   ```bash
   sudo nano /etc/systemd/system/placement-backend.service
   ```
   Add:
   ```ini
   [Unit]
   Description=Spring Boot Placement Backend
   After=syslog.target

   [Service]
   User=ubuntu
   ExecStart=/usr/bin/java -jar /home/ubuntu/app.jar
   SuccessExitStatus=143
   Environment=DB_HOST=your-rds-endpoint.amazonaws.com
   Environment=DB_PORT=5432
   Environment=DB_NAME=placement_db
   Environment=DB_USER=postgres
   Environment=DB_PASSWORD=yourpassword
   Environment=AWS_S3_BUCKET=your-bucket-name
   Environment=AWS_REGION=us-east-1
   Environment=AWS_ACCESS_KEY_ID=yourkey
   Environment=AWS_SECRET_ACCESS_KEY=yoursecret
   
   [Install]
   WantedBy=multi-user.target
   ```
8. Start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start placement-backend
   sudo systemctl enable placement-backend
   ```

### 4. Frontend Vercel Deployment
1. Put the React frontend project on GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository and pick **Vite** as the framework template.
4. Under Environment Variables, add:
   * `VITE_API_BASE_URL` = `http://your-ec2-ip:8080`
5. Click **Deploy**. Vercel will bundle and serve the app.
