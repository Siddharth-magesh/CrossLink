import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Login from './pages/Login';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import AddMembers from './pages/AddMembers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/add-members" element={<AddMembers />} />
      </Routes>
    </Router>
  );
}

export default App;
