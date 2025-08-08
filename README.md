# Sales Management System
This repository presents a fully functional sample sales management system, featuring both a modern frontend built with React, and a robust backend developed with Node.js and Express.
The system is designed to streamline core sales operations, including:
- Category and product management – allowing the creation, updating, and deletion of categories and products items.
- Order processing – handling customer orders efficiently from placement to completion.
- Integrated a password recovery feature that sends reset instructions via email using Nodemailer.
- Implemented an admin-side user role and permission management system to control access to different features.
---
This project aims to provide a practical example for developers learning full-stack web development, demonstrating frontend-backend communication, RESTful API design, database integration, and third-party service usage.
It can serve as a foundation for building more complex retail management systems, with the flexibility to add features like authentication, reporting, or payment gateway integration.
## Technologies Used
- NodeJS
- ReactJS
- MySQL
# Database Design
## Conceptual Model
<img width="982" height="763" alt="database-Conceptual Model drawio" src="https://github.com/user-attachments/assets/7205d5c2-758a-488f-8228-071b0eb93689" />

---
## Relationship Diagram
<img width="1006" height="891" alt="database-Lược đồ quan hệ drawio" src="https://github.com/user-attachments/assets/dacd2e91-cadf-413b-8ac7-fb05f9a6dbff" />

## Project Structure
```text
.
├── Admin/                     # Backend source code
│   ├── API/                    # API routes & controllers
│   ├── config/                 # Database configuration
│   ├── helper/                 # Helper functions
│   ├── public/admin/           # Public assets for admin
│   ├── validates/admin/        # Validation logic
│   ├── views/                  # View templates
│   ├── index.js                 # Backend entry point
│   └── package.json
│
├── Client/                     # Frontend source code
│   ├── public/                  # Public assets
│   ├── src/                     # React components & pages
│   ├── server.js                # Development server config
│   └── package.json
│
├── DB_MYSQL.sql                 # Database schema & sample data
└── README.md

```
## How to Run the Project
## Prerequisites
Ensure that MySQL is installed on your system and the MySQL service is running.
## Execution
### Backend (Admin Panel) Setup
1. Install MySQL and make sure the MySQL server is running.
2. Import the provided database file into MySQL.
3. Open the file:
```bash
Source/Admin/config/database.js
```
- If your MySQL has a password, update it in this file.
- If not, skip this step.
4. Open a terminal in the Source/Admin folder and run:
```bash
npm install
```
5. Start the backend server:
```bash
npm start
```
6. Open a browser and navigate to:
```bash
http://localhost:3000/admin/auth/login
```
  to access the admin panel.
### Frontend (Client) Setup
Repeat the above process for the Client folder:
1. Open a terminal in the Source/Client folder.
2. Install dependencies:
```bash
npm install
```
3. Start the client:
```bash
npm start
```
4. Open a browser and navigate to:
```bash
http://localhost:3000/login
```
  to access the home.

## Contact
For any issues or questions, please reach out to me for support.
