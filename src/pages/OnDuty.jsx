import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';
import { logoutUser } from '../utils/session';

const OnDuty = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [odList, setOdList] = useState([]);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');
    fetchOdList();
  }, []);

  const fetchOdList = async () => {
    try {
      const res = await fetch(`${url_base}/api/fetch_onduty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setOdList(data);
    } catch (err) {
      console.error("Failed to fetch OnDuty list:", err);
    }
  };

  const handleDownload = (path) => {
    const link = document.createElement('a');
    link.href = `${url_base}/${path}`;
    link.setAttribute('download', path.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this OnDuty?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${url_base}/api/delete_onduty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      const result = await res.json();
      alert(result.message || "Deleted successfully");
      fetchOdList(); // Refresh list
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div
      className="min-vh-100 bg-dark text-white p-4"
      style={{ minHeight: '100vh', backgroundColor: '#212529', overflowX: 'hidden' }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4
          className="text-danger fw-bold mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Cross<span className="text-white">Link</span>
        </h4>

        {/* Username Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {username}
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><span className="dropdown-item text-muted">Profile</span></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <h5 className="text-center mb-4">OnDuty Documents</h5>

      {/* OD Tiles */}
      <div className="row">
        {odList.map((item) => (
          <div key={item._id} className="col-md-6 col-lg-4 mb-3">
            <div className="bg-secondary p-3 rounded shadow d-flex flex-column justify-content-between h-100">
              <div>
                <h6 className="fw-bold text-white">{item.name}</h6>
                <p className="mb-1 text-light">📅 {item.date}</p>
                <p className="text-light small">{item.path}</p>
              </div>
              <div className="d-flex justify-content-start gap-2 mt-3">
                <button className="btn btn-sm btn-success" onClick={() => handleDownload(item.path)}>
                  Download
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Create OD Button */}
      <button
        className="btn btn-danger rounded-pill position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
        onClick={() => navigate('/generate-onduty')}
      >
        Create OnDuty
      </button>
    </div>
  );
};

export default OnDuty;
