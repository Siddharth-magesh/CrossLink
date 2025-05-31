import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const MainGroup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [groupNames, setGroupNames] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const registrationNumber = localStorage.getItem('userId');
    setUsername(storedUsername || 'User');

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${url_base}/api/main_group_details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: registrationNumber }),
        });

        const result = await res.json();
        if (Array.isArray(result.groups)) {
          setGroupNames(result.groups);
        } else {
          console.error('Unexpected response format:', result);
        }
      } catch (error) {
        console.error('Error fetching group names:', error);
      }
    };

    if (registrationNumber) fetchGroups();
  }, []);

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">

      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/user-dashboard')}
        >
          Cross<span className="text-white">Link</span>
        </h4>

        <span className="fw-semibold">{username}</span>
      </div>

      <h5 className="text-center mb-3">Main Groups</h5>

      {/* Group Tiles */}
      <div className="container">
        <div className="row g-3">
          {groupNames.map((groupName, idx) => (
            <div className="col-12" key={idx}>
              <div
                className="p-3 bg-secondary text-white rounded shadow"
                role="button"
                onClick={() => navigate('/group-chat')}
              >
                {groupName}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MainGroup;
