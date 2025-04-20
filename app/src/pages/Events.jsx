import { useEffect, useState } from 'react';
import { url_base } from '../config';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${url_base}/api/view_active_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const handleManageClick = (event_id) => {
    sessionStorage.setItem('eventId', event_id);
    navigate('/manage-event');
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column position-relative">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger fw-bold">Cross<span className="text-white">Link</span></h4>
        <span className="fw-semibold">{username}</span>
      </div>

      <h5 className="text-white mb-4 text-center">Manage Event</h5>

      {/* Scrollable content */}
      <div className="flex-grow-1 overflow-auto">
        {events.length === 0 ? (
          <p className="text-center text-secondary">No active events</p>
        ) : (
          events.map((event, index) => (
            <div key={event.event_id || index} className="bg-danger text-white rounded p-3 mb-3 shadow">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">{event.event_name}</h5>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => handleManageClick(event.event_id)}
                >
                  Manage
                </button>
              </div>
              <p className="mb-1"><strong>Date:</strong> {event.event_date}</p>
              <p className="mb-1"><strong>Time:</strong> {event.event_start_time} - {event.event_end_time}</p>
              <p className="mb-1"><strong>Status:</strong> {event.event_status ? "Active" : "Inactive"}</p>
              <p className="mb-0"><strong>Admin:</strong> {event.created_admin_id}</p>
            </div>
          ))
        )}
      </div>

      {/* Create Event Button */}
      <button
        className="btn btn-danger rounded-circle position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#ff5733',
          border: '3px solid #fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        title="Create Event"
        onClick={() => navigate('/create-event')}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '1.5rem', color: '#fff' }}>＋</span>
      </button>
    </div>
  );
};

export default Events;
