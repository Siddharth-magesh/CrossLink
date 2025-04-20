import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const OnDuty = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    ODname: '',
    today_date: '',
    subject: '',
    body: '',
    event_date: '',
    place: '',
    timings: '',
  });

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = async (downloadFormat) => {
    try {
      // Adding ODname and download_format to the request
      const newFormData = { ...formData, download_format: downloadFormat };

      const res = await fetch(`${url_base}/api/generate_od`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to generate OD'}`);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const disposition = res.headers.get('Content-Disposition');
      const filename = disposition?.split('filename=')[1]?.replace(/"/g, '') || `onduty.${downloadFormat}`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download Error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-4" style={{ overflowY: 'auto', backgroundColor: '#343a40' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger fw-bold mb-0" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Cross<span className="text-white">Link</span>
        </h4>
        <span className="fw-semibold">{username}</span>
      </div>

      {/* Page Heading */}
      <h5 className="text-center mb-4">On Duty Form</h5>

      {/* Form */}
      <form className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="mb-3">
          <label className="form-label">OD Name</label>
          <input type="text" className="form-control" name="ODname" value={formData.ODname} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Today's Date</label>
          <input type="date" className="form-control" name="today_date" value={formData.today_date} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input type="text" className="form-control" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea className="form-control" rows="4" name="body" value={formData.body} onChange={handleChange} required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Event Date</label>
          <input type="date" className="form-control" name="event_date" value={formData.event_date} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Place</label>
          <input type="text" className="form-control" name="place" value={formData.place} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Timings</label>
          <input type="text" className="form-control" name="timings" value={formData.timings} onChange={handleChange} required />
        </div>

        {/* Download Buttons */}
        <div className="d-flex justify-content-between gap-3 mt-4">
          <button type="button" className="btn btn-success" onClick={() => handleDownload('word')}>Download as Word</button>
          <button type="button" className="btn btn-danger" onClick={() => handleDownload('pdf')}>Download as PDF</button>
        </div>
      </form>
    </div>
  );
};

export default OnDuty;
