import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import AddMembers from "./pages/AddMembers"; /*This Page is not used in the current app*/
import ManageEvent from "./pages/ManageEvent";
import ScanQR from "./pages/ScanQR";
import ScanResult from "./pages/ScanResult";
import ManualAttendance from "./pages/ManualAttendance";
import GenerateOnDuty from "./pages/GenerateOnDuty";
import OnDuty from "./pages/OnDuty";
import Signup from "./pages/Signup";
import SignupAdmin from "./pages/Signup-admin";
import StudentManagement from "./pages/StudentManagement";
import PwaInstallPrompt from "./pages/PwaInstallPrompt";
import UserDashboard from "./pages/UserDashBoard";
import MainGroup from "./pages/MainGroup";
import ManageForm from "./pages/ManageForm";
import GroupChat from "./pages/GroupChat";
import Form from "./pages/Form";
import EventsGroup from "./pages/EventsGroup";
import EventChat from "./pages/EventChat";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <>
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
          <Route path="/user-signup" element={<Signup />} />
          <Route path="/signup-admin" element={<SignupAdmin  />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/main-group" element={<MainGroup />} />
          <Route path="/manage-form" element={<ManageForm />} />
          <Route path="/group-chat" element={<GroupChat />} />
          <Route path="/form" element={<Form />} />
          <Route path="/events-group" element={<EventsGroup />} />
          <Route path="/event-chat" element={<EventChat />} />
          <Route path="/user-profile" element={<UserProfile />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
