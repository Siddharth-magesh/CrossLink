import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import AddMembers from "./pages/AddMembers";
import ManageEvent from "./pages/ManageEvent";
import ScanQR from "./pages/ScanQR";
import ScanResult from "./pages/ScanResult";
import ManualAttendance from "./pages/ManualAttendance";
import GenerateOnDuty from "./pages/GenerateOnDuty";
import OnDuty from "./pages/OnDuty";
import Signup from "./pages/Signup";
import StudentManagement from "./pages/StudentManagement";
import PwaInstallPrompt from "./pages/PwaInstallPrompt";

function App() {
  return (
    <>
      <PwaInstallPrompt />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
