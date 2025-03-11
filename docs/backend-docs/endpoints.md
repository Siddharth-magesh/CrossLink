# **📌 API Endpoints**

### **1️⃣ Home Endpoint**

- **Endpoint:** `GET /`
- **Function:** `home()`
- **Response:**
  ```json
  {
    "message": "Welcome to CrossLink Backend!"
  }
  ```

---

### **2️⃣ Add Event**

- **Endpoint:** `POST /api/add_event`
- **Function:** `event_manager.add_event(event_data)`
- **Input JSON:**
  ```json
  {
    "event_name": "Tech Innovation Summit",
    "event_date": "2025-06-15",
    "event_start_time": "10:00",
    "event_end_time": "16:00",
    "event_location": "Downtown Convention Center",
    "created_admin_id": "ADMIN12345",
    "student_details": ["STU001", "STU002", "STU003"]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Event added successfully!",
    "event": { ... }
  }
  ```

---

### **3️⃣ Fetch Members**

- **Endpoint:**
  - `GET /api/fetch_members`
  - `POST /api/fetch_members`
- **Function:** `event_manager.fetch_members(filters)`
- **Input JSON (for `POST` request only):**
  ```json
  {
    "member_type": "student"
  }
  ```
- **Response:**
  ```json
  {
    "data": [
      {
        "member_id": "STU001",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "member_type": "student"
      },
      {
        "member_id": "STU002",
        "name": "Jane Smith",
        "email": "janesmith@example.com",
        "member_type": "student"
      }
    ]
  }
  ```
