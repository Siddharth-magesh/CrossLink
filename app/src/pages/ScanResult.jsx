import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const ScanResult = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.token) {
      alert('No QR data found');
      navigate('/scan');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${url_base}/api/fetch_individual_data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unique_token: state.token }),
        });

        const data = await res.json();
        setStudentInfo(data.student_info || null);
      } catch (err) {
        console.error('Error fetching student info:', err);
        alert('Failed to retrieve data.');
        navigate('/scan');
      }
    };

    fetchData();
  }, [state, navigate]);

  const markAttendance = async (status) => {
    if (!studentInfo) return;

    try {
      const res = await fetch(`${url_base}/api/mark_attendence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: studentInfo.event_id,
          yrc_id: studentInfo.yrc_id,
          status,
        }),
      });

      const result = await res.json();
      alert(result.message || 'Attendance marked successfully');
      navigate('/scan', { replace: true });
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      alert('Error marking attendance');
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-3">
      {/* Header Section */}
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

      {/* Heading */}
      <h4 className="text-center text-white mb-4">Verify Individual</h4>

      {/* Student Info Section */}
      {studentInfo ? (
        <div className="bg-secondary p-4 rounded">
          <h5>👤 {studentInfo.name}</h5>
          <p>🎓 Year: {studentInfo.year}</p>
          <p>🏛️ Dept: {studentInfo.department}</p>
          <p>🆔 YRC ID: {studentInfo.yrc_id}</p>

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-success w-50" onClick={() => markAttendance("present_time")}>
              Mark Present
            </button>
            <button className="btn btn-warning w-50" onClick={() => markAttendance("leaving_time")}>
              Mark Leaving
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted">Fetching student info...</p>
      )}
    </div>
  );
};

export default ScanResult;
