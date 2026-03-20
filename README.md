# Student Complaint Management System

## 1. Introduction

The Student Complaint Management System is a web-based application designed to streamline the process of submitting and managing student complaints within an institution. It provides a structured platform where students can register complaints and track their status, while an administrator can review and take appropriate actions.

---

## 2. Objectives

- To provide an easy interface for students to submit complaints
- To allow students to track the status of their complaints
- To enable the administrator to manage and resolve complaints efficiently
- To reduce manual handling and improve transparency

---

## 3. System Features

### 3.1 Student Module

- User registration and login
- Submit new complaints
- View only their own complaints
- Edit existing complaints
- Delete complaints
- Track complaint status (Pending, Resolved, Rejected)

### 3.2 Admin Module

- Login through the same authentication system
- View all submitted complaints
- View student details (name and phone number)
- Update complaint status:
  - Pending to Resolved
  - Pending to Rejected
- Complaints are displayed with latest entries first

---

## 4. Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Firebase Authentication, Firebase Firestore

---

## 5. System Design

### 5.1 Authentication

Firebase Authentication is used to handle user login and registration.  
Each user is assigned a role:
- student
- admin

Access to dashboards is controlled based on user role.

---

### 5.2 Database Structure

#### Users Collection

| Field  | Description            |
|--------|------------------------|
| name   | Student name           |
| email  | User email             |
| phone  | Contact number         |
| role   | student / admin        |

#### Complaints Collection

| Field      | Description                          |
|------------|--------------------------------------|
| userId     | ID of the student                    |
| title      | Complaint title                      |
| description| Complaint details                    |
| status     | pending / resolved / rejected        |
| createdAt  | Timestamp of submission              |

---

## 6. Workflow

1. A student registers and logs into the system
2. The student submits a complaint
3. The complaint is stored in the database with status "pending"
4. The administrator logs in and views all complaints
5. The administrator updates the complaint status
6. The student can view the updated status

---

## 7. Key Design Decisions

- A single login system is used for both students and admin
- Role-based redirection is implemented after login
- Complaints are not removed by default; status is updated for transparency
- Students can manage only their own complaints
- Admin has access to all complaints

---

## 8. Conclusion

The system successfully provides a simple and effective solution for managing student complaints. It improves communication between students and administration while maintaining transparency and ease of use.

---