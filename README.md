# CrossLink – YRC Event & Attendance Management PWA

CrossLink is a modern Progressive Web App (PWA) designed for the Youth Red Cross (YRC) of **Velammal Engineering College**. It streamlines event management, QR-based attendance, on-duty document generation, and student/member management, all with a mobile-first, installable web experience.

---

## 🚀 Features

- **Event Management:**  
  Create, manage, and close events with start/end times, locations, and member lists.

- **QR Code Attendance:**  
  Generate unique QR codes for each event member. Scan codes via mobile for instant attendance marking.

- **On-Duty Document Generation:**  
  Create and download on-duty documents in DOCX or PDF format.

- **Student Management:**  
  Bulk upload students via CSV, with support for all required fields (name, registration number, email, YRC ID, year, department, blood group, mode of transport).

- **Admin Authentication:**  
  Secure signup and login with hashed passwords.

- **Drive Integration:**  
  Create and share Google Drive folders for event resources.

- **PWA Support:**  
  Installable on mobile/desktop, works offline, and prompts users to add to home screen.

---

## 🏗️ Project Structure

```
CrossLink/
│
├── app/                # Frontend (React + Vite)
│   ├── public/         # Static assets (logo, manifest, etc.)
│   ├── src/            # React source code
│   │   ├── pages/      # Main app pages (Events, Main, Login, etc.)
│   │   ├── utils/      # Utility JS (session, config)
│   │   └── config.js   # API base URL
│   ├── index.html      # Main HTML file
│   └── vite.config.js  # Vite + PWA config
│
├── backend/            # Backend (Flask)
│   ├── app.py          # Main Flask app
│   ├── utils/          # Core logic (event_manager, authentication, etc.)
│   ├── static/         # On-duty templates, QR codes, etc.
│   └── requirements.txt# Python dependencies
│
├── sample_data/        # Example CSV/JSON for student upload
└── docs/               # Documentation
```

---

## ⚙️ Installation & Setup

### 1. Backend (Flask + MongoDB)

- **Install Python dependencies:**
  ```bash
  cd backend
  pip install -r requirements.txt
  ```

- **Set up environment variables:**  
  Create a `.env` file in `backend/`:
  ```
  SECRET_KEY=your_secret_key
  MONGO_URI=mongodb://localhost:27017/crosslink
  BASE_MAIL_ADDRESS=your_email@gmail.com
  MAIL_SERVER=smtp.gmail.com
  MAIL_PORT=587
  MAIL_USERNAME=your_email@gmail.com
  MAIL_PASSWORD=your_email_password
  MAIL_USE_TLS=True
  MAIL_USE_SSL=False
  ```

- **Run the backend:**
  ```bash
  python app.py
  ```

### 2. Frontend (React + Vite)

- **Install Node dependencies:**
  ```bash
  cd app
  npm install
  ```

- **Run the frontend (dev mode):**
  ```bash
  npm run dev -- --host
  ```

- **Build for production:**
  ```bash
  npm run build
  npm run preview -- --host
  ```

---

## 🌐 PWA Features

- **Manifest & Icons:**  
  Custom logo and manifest for installability.

- **Service Worker:**  
  Offline support via vite-plugin-pwa.

- **Install Prompt:**  
  Users are prompted to install the app on mobile/desktop.

---

## 📲 Usage

- **Login/Signup:**  
  Admins can sign up and log in securely.

- **Event Management:**  
  Create events, add members (bulk or individually), and manage attendance.

- **QR Attendance:**  
  Members receive QR codes via email. Scan codes at the event for attendance.

- **Student Management:**  
  Upload a CSV (see `sample_data/sample_students.csv`) to add students in bulk.

- **On-Duty Generation:**  
  Generate and download on-duty documents for events.

---

## 📝 Sample CSV Format

| First Name | Last Name or Surname | Registeration Number | Email ID | Year | Department | YRC ID  | Blood Group | Mode        |
| ---------- | -------------------- | -------------------- | -------- | ---- | ---------- | ------- | ----------- | ----------- |
| Siddharth  | Magesh               | 113222072094         | ...      | 3    | AIDS       | 22YRC09 | B−          | Day Scholar |

- Ignore columns like Timestamp, Username, Section, etc.

---

## 🛡️ Security

- Passwords are hashed using Werkzeug.
- Only required fields are stored from CSV uploads.
- All sensitive files (e.g., Google service account) are gitignored.

---

## 🖼️ Logo & Branding

- The app uses a custom logo (logo.jpg) for favicon and PWA icon.
- For best results, use a 512x512px logo in `app/public/logo.jpg`.

---

## 🧑‍💻 Developer Notes

- **API Endpoints:** See [`docs/backend-docs/endpoints.md`](docs/backend-docs/endpoints.md) for all backend routes.
- **Frontend Routing:** All main pages are in `app/src/pages/`.
- **PWA Install Prompt:** Controlled by `PwaInstallPrompt.jsx`.

---

## 🏫 About

CrossLink is built for the Youth Red Cross (YRC) of **Velammal Engineering College** to modernize event and attendance management, making it seamless, secure, and mobile-friendly.

---

**For any issues or contributions, please open an issue or pull request!**