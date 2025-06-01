# CrossLink – YRC Event & Attendance Management PWA (Frontend)

## 1. Project Overview

CrossLink is a Progressive Web App (PWA) designed for Youth Red Cross at Velammal Engineering College to manage events, QR-based attendance, on-duty document generation, and student/member data with a mobile-first installable experience.

## 2. Features

* Event creation, management, and closure
* QR code generation and scanning for attendance
* On-duty document generation in DOCX/PDF
* Bulk student uploads via CSV
* Admin authentication (secure login/signup)
* Google Drive folder integration
* PWA support (offline, installable)

## 3. Project Structure

```
app/
├── public/          # Static assets, manifest.json, logo, etc.
├── src/
│   ├── pages/       # Route components (Events.jsx, Login.jsx, etc.)
│   ├── components/  # Reusable UI components
│   ├── utils/       # Utility functions (API calls, config)
│   ├── config.js    # API base URL and constants
│   ├── App.jsx      # Root app with routing and PWA install prompt
│   └── main.jsx     # ReactDOM rendering and Bootstrap CSS import
├── vite.config.js   # Vite + PWA plugin configuration
```

## 4. Installation & Setup

1. Clone the repo and navigate to the frontend directory:

```bash
git clone https://github.com/Siddharth-magesh/CrossLink.git
cd CrossLink/app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app at `http://localhost:3030`

*No environment variables are required; API base URL and other constants are configured inside `src/config.js`.*

## 5. Routing

Routes are defined in `src/App.jsx` using React Router v6:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<PwaInstallPrompt />
<Router>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/main" element={<Main />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/user-login" element={<UserLogin />} />
    <Route path="/events" element={<Events />} />
    <Route path="/create-event" element={<CreateEvent />} />
    <Route path="/add-members" element={<AddMembers />} />
    <Route path="/manage-event" element={<ManageEvent />} />
    <Route path="/scan" element={<ScanQR />} />
    <Route path="/scan-result" element={<ScanResult />} />
    <Route path="/manual-attendance" element={<ManualAttendance />} />
    <Route path="/generate-onduty" element={<GenerateOnDuty />} />
    <Route path="/onduty" element={<OnDuty />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/student-management" element={<StudentManagement />} />
    <Route path="/user-dashboard" element={<UserDashboard />} />
    <Route path="/main-group" element={<MainGroup />} />
    <Route path="/manage-form" element={<ManageForm />} />
    <Route path="/group-chat" element={<GroupChat />} />
    <Route path="/form" element={<Form />} />
    <Route path="/events-group" element={<EventsGroup />} />
    <Route path="/event-chat" element={<EventChat />} />
    {/* Add more routes as needed */}
  </Routes>
</Router>
```

## 6. State Management

The project primarily uses React's local state (`useState`) for managing component state. No external state management library is used currently.

*If your project grows more complex, you may consider Context API or Redux, but for now, `useState` suffices.*

## 7. API Handling

API calls are performed using the native `fetch` API with async/await syntax.

Base API URL and constants are centralized in `src/config.js`(if not present create one with contents : export const url_base = ""). API utility functions are located in `src/utils/api.js` (or similar).

Example usage:

```js
import { API_BASE_URL } from '../config';

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  const data = await response.json();
  return data;
}
```

## 8. Bootstrap Integration

Bootstrap 5 CSS is imported globally in `src/main.jsx`:

```js
import 'bootstrap/dist/css/bootstrap.min.css';
```

The app uses Bootstrap classes for layout and UI styling, ensuring responsive and consistent design.

## 9. Adding New Pages & Components

To add a new page:

1. Create a new file inside `src/pages/`, e.g., `NewPage.jsx`.
2. Add the new route to `src/App.jsx` within the `<Routes>` component.
3. For reusable UI elements, create components in `src/components/`.

Naming conventions follow PascalCase for React components and files.

## 10. Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## 11. PWA Support

The PWA functionality is implemented via `vite-plugin-pwa` configured in `vite.config.js`. Features include offline caching and prompting users to install the app to their home screen.

`PwaInstallPrompt` component in `App.jsx` handles the install prompt UI.
