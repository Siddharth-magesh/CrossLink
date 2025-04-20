import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'User');
  }, []);

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')} // Navigate to home on click
        >
          Cross<span className="text-white">Link</span>
        </h4>
        <span className="fw-semibold">{username}</span>
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
            <div className="p-4 bg-danger text-white rounded text-center fw-bold shadow"
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
