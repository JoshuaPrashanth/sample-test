# Student Complaint Management System (SCMS)

## 1. Overview
The Student Complaint Management System (SCMS) is a web-based application designed to provide a simple and efficient platform for students to register complaints and for an administrator to manage them effectively. The system improves transparency, reduces manual work, and ensures proper tracking of complaints within an institution.

---

## 2. Users
- Student
- Admin (Single Admin)

---

## 3. Functional Requirements

### 3.1 Student Features
- Register with:
  - Name
  - Email
  - Password
  - Phone Number
- Login securely
- Submit a complaint:
  - Title
  - Description
- View only their own complaints
- View complaint status:
  - Pending
  - Resolved
  - Rejected
- Edit their own complaints
- Delete their own complaints

---

### 3.2 Admin Features
- Secure login (single admin)
- View all complaints
- View student details:
  - Name
  - Email
  - Phone Number
- Update complaint status:
  - Pending → Resolved
  - Pending → Rejected
- Delete any complaint

---

## 4. Complaint Properties
Each complaint will contain:
- Complaint ID
- User ID (reference to student)
- Title
- Description
- Status (Pending / Resolved / Rejected)
- Created At (timestamp)

---

## 5. Business Logic

- Students can only view their own complaints
- Students can edit only their own complaints
- Students can delete only their own complaints
- Students cannot edit or delete complaints after they are marked as:
  - Resolved
  - Rejected

- Complaints are displayed differently based on user role:
  - For Admin:
    - Oldest complaints first (higher priority)
  - For Students:
    - Newest complaints first (recent activity first)

- Edited complaints retain their original creation date

- Admin can view all complaints
- Admin can update complaint status:
  - Pending → Resolved
  - Pending → Rejected
- Admin can delete any complaint

---

## 6. Non-Functional Requirements

- Simple and user-friendly interface
- Responsive design (mobile & desktop compatible)
- Fast performance and minimal loading time
- Secure authentication and data handling
- Reliable data storage using Firebase Firestore

---

## 7. Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Firebase Authentication
- Firebase Firestore Database

---

## 8. Constraints

- No complaint categories
- Only one admin user
- No advanced priority system (priority based only on time)
- No file/image upload feature

---