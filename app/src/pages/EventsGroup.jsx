import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const EventsGroup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [eventGroups, setEventGroups] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const registrationNumber = localStorage.getItem('userId');
    setUsername(storedUsername || 'User');

    const fetchEventGroups = async () => {
      try {
        const res = await fetch(`${url_base}/api/event_group_details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: registrationNumber }),
        });

        const result = await res.json();
        if (Array.isArray(result.event_groups)) {
          setEventGroups(result.event_groups);
        } else {
          console.error('Unexpected response:', result);
        }
      } catch (error) {
        console.error('Error fetching event groups:', error);
      }
    };

    if (registrationNumber) fetchEventGroups();
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

      <h5 className="text-center mb-3">Event-Based Groups</h5>

      {/* Group Tiles */}
      <div className="container">
        <div className="row g-3">
          {eventGroups.map((group, idx) => (
            <div className="col-12" key={idx}>
              <div
                className="p-3 bg-danger text-white rounded shadow"
                role="button"
                onClick={() => navigate('/event-chat', {
                  state: {
                    group_id: group.group_id,
                    group_name: group.group_name,
                    isEventGroup: true
                  }
                })}
              >
                {group.group_name}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EventsGroup;
