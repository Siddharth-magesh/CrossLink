# CrossLink Backend API Endpoints

This document describes all REST API endpoints for the CrossLink backend (Flask) for Velammal Engineering College YRC event management.

---

## Authentication

### POST `/api/admin_login`
- **Description:** Admin login with registration number and password.
- **Request JSON:**
  ```json
  {
    "registration_number": "113222072094",
    "password": "your_password"
  }
  ```
- **Response:**
  - 200: `{ "message": "Login successful", "token": "...", "username": "..." }`
  - 401: `{ "error": "Invalid credentials" }`

### POST `/api/signup`
- **Description:** Admin signup. Stores hashed password.
- **Request JSON:**
  ```json
  {
    "registration_number": "113222072094",
    "name": "Siddharth",
    "password": "your_password",
    "email": "siddharth@example.com"
  }
  ```
- **Response:**
  - 201: `{ "message": "Signup successful" }`
  - 409: `{ "error": "User already exists" }`

### POST `/api/fetch_admin_profile`
- **Description:** Fetch admin profile by username.
- **Request JSON:** `{ "username": "Siddharth" }`
- **Response:** `{ "name": "Siddharth", "email": "..." }`

---

## Event Management

### POST `/api/add_event`
- **Description:** Create a new event.
- **Request JSON:**
  ```json
  {
    "event_name": "Walk For Plastic",
    "event_date": "2025-05-04",
    "event_start_time": "09:00",
    "event_end_time": "17:00",
    "event_location": "Auditorium",
    "created_admin_id": "113222072094",
    "student_details": [],
    "event_status": true,
    "drive_link": "..."
  }
  ```
- **Response:** `{ "message": "Event added successfully!", "event": { ... } }`

### POST `/api/add_members`
- **Description:** Add members to an event (bulk add by YRC IDs).
- **Request JSON:**
  ```json
  {
    "event_id": "...",
    "yrc_members_id": ["22YRC09", "23YRC32", ...]
  }
  ```
- **Response:** `{ "message": "Members added and emails sent successfully" }`

### POST `/api/view_events`
- **Description:** View events by status.
- **Request JSON:** `{ "status": true }`
- **Response:** `{ "events": [ ... ] }`

### POST `/api/fetch_event_details`
- **Description:** Get details for a specific event.
- **Request JSON:** `{ "event_id": "..." }`
- **Response:** `{ "event data": { ... } }`

### POST `/api/close_events`
- **Description:** Close an event (set event_status to false).
- **Request JSON:** `{ "event_id": "..." }`
- **Response:** `{ "message": "Event closed successfully" }`

---

## Attendance

### POST `/api/mark_attendence`
- **Description:** Mark attendance for a member (present_time or leaving_time).
- **Request JSON:**
  ```json
  {
    "event_id": "...",
    "yrc_id": "22YRC09",
    "status": "present_time" // or "leaving_time"
  }
  ```
- **Response:** `{ "message": "Attendance marked successfully" }`

### POST `/api/fetch_individual_data`
- **Description:** Get student info by unique QR token.
- **Request JSON:** `{ "unique_token": "eventid-yrcid" }`
- **Response:** `{ "student_info": { ... } }`

### POST `/api/fetch_individual_data_manual`
- **Description:** Get student info by event_id and yrc_id or registration_number.
- **Request JSON:**
  ```json
  {
    "event_id": "...",
    "yrc_id": "...", // or "registration_number": "..."
  }
  ```
- **Response:** `{ "student_info": { ... } }`

---

## Student Management

### POST `/api/upload_members_data`
- **Description:** Upload a CSV file to bulk add students. Only required fields are stored.
- **Request:**
  - `multipart/form-data` with a `file` field (CSV file)
- **Response:** `{ "message": "N students added successfully" }`

### POST `/api/fetch_members`
- **Description:** Fetch all members or filter by fields.
- **Request JSON:** (optional filters)
  ```json
  {
    "department": "CSE"
  }
  ```
- **Response:** `{ "data": [ ... ] }`

---

## On-Duty Management

### POST `/api/generate_od`
- **Description:** Generate an on-duty document (DOCX or PDF).
- **Request JSON:**
  ```json
  {
    "ODname": "Siddharth",
    "today_date": "2025-05-04",
    "subject": "YRC Event",
    "body": "...",
    "event_date": "2025-05-04",
    "place": "Auditorium",
    "timings": "09:00-17:00",
    "download_format": "pdf" // or "docx"
  }
  ```
- **Response:** File download (PDF or DOCX)

### POST `/api/fetch_onduty`
- **Description:** Fetch all on-duty records.
- **Response:** List of on-duty records.

### POST `/api/download_onduty`
- **Description:** Download a specific on-duty file.
- **Request JSON:** `{ "file_path": "..." }`
- **Response:** File download

### POST `/api/delete_onduty`
- **Description:** Delete a specific on-duty record.
- **Request JSON:** `{ "_id": "..." }`
- **Response:** Success or error message

---

## Google Drive Integration

### POST `/api/create_drive_folder`
- **Description:** Create a Google Drive folder for an event and return the shareable link.
- **Request JSON:** `{ "event_name": "Blockathon" }`
- **Response:** `{ "success": true, "folder_id": "...", "folder_link": "..." }`

---

## Miscellaneous

### GET `/`
- **Description:** Health check. Returns welcome message.
- **Response:** `{ "message": "Welcome to CrossLink Backend!" }`

---

## Notes
- All endpoints support CORS.
- All responses are JSON unless a file download is specified.
- Passwords are always hashed in the database.
- For CSV upload, only required fields are stored; extra columns are ignored.
- For any questions, see the main [README.md](../../README.md).
