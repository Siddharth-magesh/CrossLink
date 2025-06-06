# CrossLink Database Structure

This document describes the MongoDB database structure for the **CrossLink** application.

---

## Database Name

```
crosslink
```

---

## Collections

- `admin_members`
- `event_chats`
- `event_forms`
- `events`
- `group_chats`
- `members`
- `onduty`

---

## Collection Schemas

### 1. `admin_members`

**Description:** Stores admin user details.

**Sample Document:**
```json
{
  "_id": { "$oid": "681f8b611e7c9be148cd0779" },
  "registration_number": "113222072094",
  "name": "Siddharth Magesh",
  "password": "scrypt:32768:8:1$O8wx2Ylb9Y5nTFQm$1c0e3c6a31cddc3ad563ab14d6c957b9d3589fce6299370e0a05adbfd7eb0364be7bb62f1d5c2d5b133d3d3f462ca7d12d00fb438c94f43012223a7b3182c35f",
  "email": "siddharthmagesh@gmail.com",
  "role": "admin"
}
```

---

### 2. `members`

**Description:** Stores member (student/volunteer) details.

**Sample Document:**
```json
{
  "yrc_id": "21yrc01",
  "registration_number": "113222072001",
  "email": "slathasree1975@gmail.com",
  "password": "scrypt:32768:8:1$O8wx2Ylb9Y5nTFQm$1c0e3c6a31cddc3ad563ab14d6c957b9d3589fce6299370e0a05adbfd7eb0364be7bb62f1d5c2d5b133d3d3f462ca7d12d00fb438c94f43012223a7b3182c35f",
  "name": "test1",
  "desgination": "Volunteer",
  "year": 4,
  "department": "CSE",
  "section": "A",
  "mobile_number": "1234567890",
  "address": "123 Main St, City, Country",
  "secondary_mobile_number": "0987654321",
  "blood_group": "O+",
  "date_of_birth": "2000-01-01",
  "events_attended": 0,
  "allocated_groups": [
    {
      "group_id": "21yrc01g01",
      "group_name": "YRC Fourth Year"
    }
  ],
  "event_groups": []
}
```

---

### 3. `event_chats`

**Description:** Stores chat messages related to specific events.

**Sample Document:**
```json
{
  "_id": "...",
  "event_id": "event123",
  "messages": [
    {
      "sender_id": "113222072001",
      "message": "Welcome to the event!",
      "timestamp": "2024-06-01T10:00:00Z"
    }
  ]
}
```

---

### 4. `event_forms`

**Description:** Stores forms associated with events.

**Sample Document:**
```json
{
  "_id": "...",
  "event_id": "event123",
  "form_fields": [
    { "field_name": "Name", "type": "text", "required": true }
  ],
  "responses": [
    {
      "registration_number": "113222072001",
      "answers": { "Name": "John Doe" }
    }
  ]
}
```

---

### 5. `events`

**Description:** Stores event details.

**Sample Document:**
```json
{
  "_id": "...",
  "event_id": "event123",
  "event_name": "Blood Donation Camp",
  "date": "2024-06-10",
  "location": "Auditorium",
  "description": "Annual blood donation drive.",
  "eligible_years": [2, 3, 4]
}
```

---

### 6. `group_chats`

**Description:** Stores chat messages for groups.

**Sample Document:**
```json
{
  "_id": "...",
  "group_id": "21yrc01g01",
  "messages": [
    {
      "sender_id": "113222072001",
      "message": "Hello group!",
      "timestamp": "2024-06-01T09:00:00Z"
    }
  ]
}
```

---

### 7. `onduty`

**Description:** Stores on-duty certificate generation and records.

**Sample Document:**
```json
{
  "_id": "...",
  "registration_number": "113222072001",
  "event_id": "event123",
  "od_file_path": "/path/to/od.docx",
  "generated_at": "2024-06-01T12:00:00Z"
}
```

---

## Notes

- All passwords are securely hashed (e.g., using scrypt).
- Timestamps are in ISO 8601 format.
- The above schemas are samples; actual documents may contain additional fields as required by the application.

---