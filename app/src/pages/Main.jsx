import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/session';

const Main = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'User');
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Cross<span className="text-white">Link</span>
        </h4>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {username}
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li>
              <span className="dropdown-item text-muted">Profile</span>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tiles Section */}
      <div className="container">
        <div className="row g-3">
          <div className="col-6">
            <div
              className="p-4 bg-danger text-white rounded text-center fw-bold shadow"
              role="button"
              onClick={() => navigate('/events')}
            >
              Events
            </div>
          </div>
          <div className="col-6">
            <div className="p-4 bg-danger text-white rounded text-center fw-bold shadow">
              Attendance
            </div>
          </div>
          <div className="col-6">
            <div
              className="p-4 bg-danger text-white rounded text-center fw-bold shadow"
              role="button"
              onClick={() => navigate('/onduty')}
            >
              OnDuty
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Main;
