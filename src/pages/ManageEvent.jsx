import { useEffect, useState, useRef } from 'react';
import { url_base } from '../config';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const ManageEvent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const pdfRef = useRef(); // NEW: Reference to the content we want to export

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

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `${eventDetails?.event_name || 'event'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Cross<span className="text-white">Link</span>
        </h4>
        <span className="fw-semibold">{username}</span>
      </div>

      {/* Title */}
      <h5 className="text-white mb-4 text-center">Manage Event</h5>

      {/* PDF Wrapper */}
      <div ref={pdfRef}> {/* NEW: Wrap the content you want in PDF */}

        {/* Event Data */}
        {eventDetails && (
          <div className="mb-4 bg-secondary p-3 rounded">
            <h6 className="fw-bold">{eventDetails.event_name}</h6>
            <p className="mb-1">📅 {eventDetails.event_date}</p>
            <p className="mb-1">⏰ {eventDetails.event_start_time} - {eventDetails.event_end_time}</p>
            <p className="mb-1">📍 {eventDetails.event_location}</p>
            <p className="mb-3">👤 Created by: {eventDetails.created_admin_id}</p>

            {/* Close Event Button */}
            <button
              className="btn btn-danger me-2"
              onClick={async () => {
                const confirmClose = window.confirm("Are you sure you want to close this event?");
                if (confirmClose) {
                  try {
                    const res = await fetch(`${url_base}/api/close_events`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ event_id: eventDetails.event_id }),
                    });
                    const result = await res.json();
                    alert(result.message || 'Event closed successfully');
                    navigate('/events');
                  } catch (err) {
                    console.error('Error closing event:', err);
                    alert('Failed to close the event.');
                  }
                }
              }}
            >
              Close Event
            </button>

            {/* Download PDF Button */}
            <button className="btn btn-light" onClick={handleDownloadPDF}>
              Download PDF
            </button>
            {/* Get Drive Link Button */}
            <button
              className="btn btn-warning mt-3"
              onClick={async () => {
                try {
                  const res = await fetch(`${url_base}/api/create_drive_folder`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event_name: eventDetails?.event_name }),
                  });
                  const result = await res.json();

                  if (result.success && result.folder_link) {
                    setDriveLink(result.folder_link);
                  } else {
                    alert(result.error || 'Failed to get Drive link');
                  }
                } catch (err) {
                  console.error('Error fetching drive link:', err);
                  alert('Error occurred while generating Drive link');
                }
              }}
            >
              Get Drive Link
            </button>

            {/* Show Drive Link if available */}
            {driveLink && (
              <div className="mt-3">
                <label className="d-block mb-1 text-white">Drive Link:</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={driveLink}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-light"
                    onClick={() => {
                      navigator.clipboard.writeText(driveLink);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendance Table */}
        {eventDetails?.student_details?.length > 0 && (
          <div className="table-responsive">
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
                    <td>
                      {student.status == null
                        ? 'Not Marked'
                        : student.status === true
                        ? 'Present'
                        : 'Absent'}
                    </td>
                    <td>
                      {student.present_time
                        ? new Date(student.present_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})
                        : '-'}
                    </td>
                    <td>
                      {student.leaving_time
                        ? new Date(student.leaving_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div> {/* End PDF content */}

      {/* Floating Mark Attendance Button */}
      <button
        className="btn btn-success rounded-pill position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
        onClick={() => navigate('/scan')}
      >
        Mark Attendance
      </button>
    </div>
  );
};

export default ManageEvent;
