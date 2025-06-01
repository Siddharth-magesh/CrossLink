import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const ManageForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [formMembers, setFormMembers] = useState([]);
  const [eventClosed, setEventClosed] = useState(false);
  const [formAlreadyClosed, setFormAlreadyClosed] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');
    fetchFormMembers();
  }, []);

  const fetchFormMembers = async () => {
    const event_id = sessionStorage.getItem('eventId');
    if (!event_id) return;

    try {
      const res = await fetch(`${url_base}/api/view_event_form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id }),
      });

      if (res.status === 403) {
        const result = await res.json();
        setMessage(result.message || 'The form has been closed.');
        setFormAlreadyClosed(true);
        return;
      }

      const result = await res.json();
      setFormMembers(result.members || []);
    } catch (error) {
      console.error('Error fetching form members:', error);
      setMessage('Error fetching form data.');
    }
  };

  const closeForm = async () => {
    const event_id = sessionStorage.getItem('eventId');
    if (!event_id) return;

    try {
      const res = await fetch(`${url_base}/api/close_form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('Form closed successfully.');
        setEventClosed(true);
      } else {
        setMessage(result.error || result.message || 'Failed to close form.');
      }
    } catch (error) {
      console.error('Error closing form:', error);
      setMessage('Error occurred while closing the form.');
    }
  };

  const getTransportRowClass = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'public':
        return 'table-success'; // Green
      case 'own':
        return 'table-warning'; // Yellow
      case 'college':
        return 'table-info'; // Light blue
      default:
        return '';
    }
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
      <h5 className="text-white mb-3 text-center">Event Form Submissions</h5>

      {/* Stop Button */}
      <div className="text-center mb-3">
        <button
          className="btn btn-danger"
          onClick={closeForm}
          disabled={eventClosed || formAlreadyClosed}
        >
          {eventClosed || formAlreadyClosed ? 'Form Closed' : 'Stop Receiving Responses'}
        </button>
        {message && <p className="mt-2 text-warning">{message}</p>}
      </div>

      {/* Table or Message */}
      {!formAlreadyClosed ? (
        <div className="table-responsive bg-secondary p-3 rounded">
          {formMembers.length > 0 ? (
            <table className="table table-bordered table-dark table-striped mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Year</th>
                  <th>Department</th>
                  <th>Mode of Transport</th>
                </tr>
              </thead>
              <tbody>
                {formMembers.map((member, index) => (
                  <tr
                    key={index}
                    className={getTransportRowClass(member.mode_of_transport)}
                  >
                    <td>{member.name}</td>
                    <td>{member.year}</td>
                    <td>{member.department}</td>
                    <td>{member.mode_of_transport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white text-center mb-0">
              No members have filled the form yet.
            </p>
          )}
        </div>
      ) : (
        <div className="text-center text-light fs-5 mt-4">
          <p>This form has been closed and cannot be viewed.</p>
        </div>
      )}
    </div>
  );
};

export default ManageForm;
