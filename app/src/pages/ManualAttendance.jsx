import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const ManualAttendance = () => {
  const [yrcId, setYrcId] = useState('');
  const [regNo, setRegNo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventId = sessionStorage.getItem('eventId');
    if (!eventId) return alert("No event selected");

    const payload = {
      event_id: eventId,
      ...(yrcId ? { yrc_id: yrcId } : { registration_number: regNo })
    };

    try {
      const res = await fetch(`${url_base}/api/fetch_individual_data_manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.student_info) {
        navigate('/scan-result', { state: { token: `${eventId}-${data.student_info.yrc_id}` } });
      } else {
        alert(data.error || "Failed to fetch student info");
      }
    } catch (err) {
      console.error("Manual fetch failed:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="vh-100 bg-dark text-white d-flex flex-column p-3">
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5
        className="text-danger fw-bold mb-0"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Cross<span className="text-white">Link</span>
      </h5>
      <span>{localStorage.getItem('username') || 'User'}</span>
    </div>

      {/* Title */}
      <h4 className="text-center mb-4">Manual Attendance Entry</h4>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>YRC ID</label>
          <input
            type="text"
            className="form-control"
            value={yrcId}
            onChange={(e) => setYrcId(e.target.value)}
            placeholder="Enter YRC ID"
          />
        </div>
        <div className="text-center mb-2">or</div>
        <div className="form-group mb-3">
          <label>Registration Number</label>
          <input
            type="text"
            className="form-control"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            placeholder="Enter Registration Number"
          />
        </div>
        <button className="btn btn-danger w-100" type="submit">
          Fetch Student Info
        </button>
      </form>
    </div>
  );
};

export default ManualAttendance;
