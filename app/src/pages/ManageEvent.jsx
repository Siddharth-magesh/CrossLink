import { useEffect, useState } from 'react';
import { url_base } from '../config';

const ManageEvent = () => {
  const [username, setUsername] = useState('');
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    const event_id = sessionStorage.getItem('eventId');
    if (!event_id) return;

    try {
      const res = await fetch(`${url_base}/api/fetch_event_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id }),
      });
      const result = await res.json();
      setEventDetails(result['event data']);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger fw-bold">Cross<span className="text-white">Link</span></h4>
        <span className="fw-semibold">{username}</span>
      </div>

      {/* Event Title */}
      <h5 className="text-white mb-4 text-center">Manage Event</h5>

      {/* Event Data */}
      {eventDetails && (
        <div className="mb-4 bg-secondary p-3 rounded">
          <h6 className="fw-bold">{eventDetails.event_name}</h6>
          <p className="mb-1">📅 {eventDetails.event_date}</p>
          <p className="mb-1">⏰ {eventDetails.event_start_time} - {eventDetails.event_end_time}</p>
          <p className="mb-1">📍 {eventDetails.event_location}</p>
          <p className="mb-0">👤 Created by: {eventDetails.created_admin_id}</p>
        </div>
      )}

      {/* Attendance Table */}
      {eventDetails?.student_details?.length > 0 && (
        <div className="table-responsive flex-grow-1 overflow-auto">
          <table className="table table-bordered table-dark table-striped">
            <thead>
              <tr>
                <th>YRC ID</th>
                <th>Status</th>
                <th>Present Time</th>
                <th>Leaving Time</th>
              </tr>
            </thead>
            <tbody>
              {eventDetails.student_details.map((student, index) => (
                <tr key={index}>
                  <td>{student.yrc_id}</td>
                  <td>{student.status ?? 'Not Marked'}</td>
                  <td>{student.present_time ?? '-'}</td>
                  <td>{student.leaving_time ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hovering Mark Attendance Button */}
      <button
        className="btn btn-success rounded-pill position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        onClick={() => alert("Attendance marking screen not implemented yet")}
      >
        Mark Attendance
      </button>
    </div>
  );
};

export default ManageEvent;
