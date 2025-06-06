import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const StudentGrievances = () => {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [responseMap, setResponseMap] = useState({});
  const username = localStorage.getItem('username') || 'Admin';

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await fetch(`${url_base}/api/student_grievances`);
        const data = await res.json();
        if (res.ok) setGrievances(data);
      } catch (err) {
        console.error('Failed to fetch grievances:', err);
      }
    };

    fetchGrievances();
  }, []);

  const handleResponseChange = (requestId, value) => {
    setResponseMap({ ...responseMap, [requestId]: value });
  };

  const handleClose = async (requestId) => {
    const managed_admin_id = localStorage.getItem('userId');
    const response_notes = responseMap[requestId];

    try {
      const res = await fetch(`${url_base}/api/close_grievance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, managed_admin_id, response_notes }),
      });

      const data = await res.json();
      alert(data.message || 'Response submitted');
      window.location.reload();
    } catch (err) {
      alert('Failed to close grievance. Please try again.');
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column overflow-auto">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger fw-bold mb-0" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Cross<span className="text-white">Link</span>
        </h4>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {username}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><span className="dropdown-item text-muted">Profile</span></li>
            <li>
              <button className="dropdown-item text-danger" onClick={() => {
                localStorage.clear();
                navigate('/');
              }}>Logout</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Title */}
      <h5 className="text-white fw-bold mb-3">Student Grievances Management</h5>

      {/* Grievances List */}
      <div className="container">
        <div className="row g-3">
          {grievances.map((grievance) => (
            <div key={grievance.request_id} className="col-12">
              <div className="p-3 rounded bg-secondary shadow text-white">
                <h6 className="fw-bold text-warning">{grievance.category}</h6>
                <p><strong>Subject:</strong> {grievance.subject}</p>
                <p><strong>Description:</strong> {grievance.description}</p>
                <p><strong>Email:</strong> {grievance.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {grievance.phone_number || 'N/A'}</p>
                <p><strong>Preferred Time:</strong> {grievance.preferred_contact_time || 'N/A'}</p>
                <p><strong>Anonymous:</strong> {grievance.anonymous ? 'Yes' : 'No'}</p>
                <p><strong>Notes:</strong> {grievance.additional_notes || 'N/A'}</p>

                {!grievance.anonymous && (
                  <>
                    <hr className="border-light" />
                    <p><strong>Student Name:</strong> {grievance.student_name || 'N/A'}</p>
                    <p><strong>Year:</strong> {grievance.year || 'N/A'}</p>
                    <p><strong>Department:</strong> {grievance.department || 'N/A'}</p>
                  </>
                )}

                <textarea
                  className="form-control mb-2"
                  placeholder="Type your response here..."
                  value={responseMap[grievance.request_id] || ''}
                  onChange={(e) => handleResponseChange(grievance.request_id, e.target.value)}
                ></textarea>

                <button
                  className="btn btn-danger w-100"
                  onClick={() => handleClose(grievance.request_id)}
                >
                  Close Grievance
                </button>
              </div>
            </div>
          ))}

          {grievances.length === 0 && (
            <div className="col-12 text-center text-muted">No active grievances to show.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentGrievances;
