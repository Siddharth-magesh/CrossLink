import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const Forum = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    phone_number: '',
    preferred_contact_time: '',
    email: '',
    anonymous: false,
    additional_notes: ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Event Related',
    'Personal Support',
    'Academic Help',
    'Volunteering Difficulty',
    'Medical Emergency',
    'Transport Issues',
    'Accommodation Issues',
    'Technical/Platform Issues',
    'Interpersonal Conflicts',
    'Feedback/Suggestions',
    'Others'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setError('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`${url_base}/api/forum_query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage(
          'Your request has been successfully sent to the authorities. You will be contacted via your provided phone number.'
        );
        setFormData({
          category: '',
          subject: '',
          description: '',
          phone_number: '',
          preferred_contact_time: '',
          email: '',
          anonymous: false,
          additional_notes: ''
        });
      } else {
        setError(
          data.error || 'Failed to send your query. Please reach out to one of the core members directly.'
        );
      }
    } catch (err) {
      setError('Server unreachable. Please try again later or contact a core member.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center text-danger">Student Grievance Form</h2>

      {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Category of Query</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a Category --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Subject (Optional)</label>
          <input
            type="text"
            className="form-control"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief title for your query"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Detailed Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe your query or grievance in detail"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number (Optional)</label>
          <input
            type="tel"
            className="form-control"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="You'll be contacted on this number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Time to Contact (Optional)</label>
          <input
            type="text"
            className="form-control"
            name="preferred_contact_time"
            value={formData.preferred_contact_time}
            onChange={handleChange}
            placeholder="e.g., Weekdays after 5 PM"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address (Optional)</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="For written responses"
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange}
          />
          <label className="form-check-label">Submit anonymously</label>
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Notes (Optional)</label>
          <textarea
            className="form-control"
            name="additional_notes"
            rows="3"
            value={formData.additional_notes}
            onChange={handleChange}
            placeholder="Any extra information or comments"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-danger">Submit</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forum;
