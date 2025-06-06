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

  const tiles = [
    { label: 'Events', route: '/events' },
    { label: 'Attendance', route: '/attendance' },
    { label: 'OnDuty', route: '/onduty' },
    { label: 'Manage Students', route: '/student-management' },
    { label: 'Grievance Dashboard', route: '/student-grievances' },
  ];

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column overflow-auto">
      
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
              <span className="dropdown-item text-muted" role="button" onClick={() => navigate('/profile')}>
                Profile
              </span>
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {tiles.map((tile, index) => (
            <div className="col" key={index}>
              <div
                className="p-4 bg-danger text-white rounded text-center fw-bold shadow h-100"
                role="button"
                onClick={() => navigate(tile.route)}
              >
                {tile.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Main;
