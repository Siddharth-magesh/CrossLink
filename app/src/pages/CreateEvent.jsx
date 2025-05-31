import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const CreateEvent = () => {
  const [username, setUsername] = useState('');
  const [eventData, setEventData] = useState({
    event_name: '',
    event_date: '',
    event_start_time: '',
    event_end_time: '',
    event_location: '',
  });
  const [selectedYears, setSelectedYears] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');
  }, []);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedYears([...selectedYears, year]);
    } else {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...eventData,
      event_status: true,
      student_details: [],
      drive_link: '',
      created_admin_id: localStorage.getItem('userId'),
      eligible_years: selectedYears,
    };

    try {
      const res = await fetch(`${url_base}/api/add_event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        const eventId = result.event.event_id;
        sessionStorage.setItem('eventId', eventId);
        alert('Event created successfully!');
        navigate('/manage-event');
      } else {
        alert('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger fw-bold">Cross<span className="text-white">Link</span></h4>
        <span className="fw-semibold">{username}</span>
      </div>

      <h5 className="text-white mb-4 text-center">Create Event</h5>

      <div className="container">
        {['event_name', 'event_date', 'event_start_time', 'event_end_time', 'event_location'].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label text-capitalize text-white">
              {field.replace(/_/g, ' ')}
            </label>
            <input
              id={field}
              type={field.includes('date') ? 'date' : field.includes('time') ? 'time' : 'text'}
              name={field}
              className="form-control"
              value={eventData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Year Checkboxes */}
        <div className="mb-4">
          <label className="form-label text-white d-block">Eligible Years</label>
          <div className="d-flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((year) => (
              <div className="form-check" key={year}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`year-${year}`}
                  value={year}
                  onChange={handleYearChange}
                />
                <label className="form-check-label" htmlFor={`year-${year}`}>
                  Year {year}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-danger w-100 fw-bold" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
