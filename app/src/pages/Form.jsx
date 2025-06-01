import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { url_base } from '../config';

const Form = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, registrationNumber } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    year: '',
    department: '',
    mode_transport: 'public',
    address: '',
    number: '',
    emergency_contact: '',
    agreed: false,
  });

  const [formOpen, setFormOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFormStatus = async () => {
      try {
        const res = await fetch(`${url_base}/api/form_status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId }),
        });
        const result = await res.json();
        setFormOpen(result.form_status === true);
      } catch (error) {
        console.error('Error checking form status:', error);
        setFormOpen(false); // fallback to closed
      } finally {
        setLoading(false);
      }
    };

    checkFormStatus();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    try {
      const res = await fetch(`${url_base}/api/submit_form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          event_id: eventId,
          registration_number: registrationNumber,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert('Form submitted successfully!');
        navigate('/main-group');
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form.');
    }
  };

  if (loading) {
    return (
      <div className="vh-100 bg-dark text-white d-flex justify-content-center align-items-center">
        <p className="fs-5">Loading form...</p>
      </div>
    );
  }

  if (!formOpen) {
    return (
      <div className="vh-100 bg-dark text-white d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h4 className="text-danger mb-3">This form is currently closed.</h4>
          <p>Please contact the event organizer for more information.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-dark text-white d-flex flex-column justify-content-center align-items-center p-3"
      style={{ minHeight: '100vh', overflowY: 'auto' }}
    >
      <div className="w-100" style={{ maxWidth: '600px', width: '100%' }}>
        <h4 className="text-center text-danger mb-4">Event Participation Form</h4>
        <form onSubmit={handleSubmit} className="bg-secondary p-4 rounded shadow">
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="year" className="form-label fw-semibold">Year</label>
            <input
              type="number"
              id="year"
              className="form-control"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1"
              max="4"
              placeholder="1 - 4"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="department" className="form-label fw-semibold">Department</label>
            <input
              type="text"
              id="department"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="e.g. CSE, ECE"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mode_transport" className="form-label fw-semibold">Mode of Transport</label>
            <select
              id="mode_transport"
              className="form-select"
              name="mode_transport"
              value={formData.mode_transport}
              onChange={handleChange}
              required
            >
              <option value="public">Public</option>
              <option value="own">Own</option>
              <option value="college">College</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label fw-semibold">Address</label>
            <textarea
              id="address"
              className="form-control"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your full address"
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="number" className="form-label fw-semibold">Phone Number</label>
            <input
              type="tel"
              id="number"
              className="form-control"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="emergency_contact" className="form-label fw-semibold">Emergency Contact Number</label>
            <input
              type="tel"
              id="emergency_contact"
              className="form-control"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              required
              placeholder="Contact person’s number"
            />
          </div>

          <div className="mb-4">
            <p className="mb-2" style={{ fontSize: '0.9rem' }}>
              I agree to the <strong>terms and conditions</strong> and I am aware that I am participating at my own risk.
            </p>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreed"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreed" className="form-check-label">
                I understand and take responsibility.
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success fw-semibold">
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
