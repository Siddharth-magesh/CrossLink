import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const StudentEdit = () => {
  const { state } = useLocation();
  const registration_number = state?.registration_number;

  const [student, setStudent] = useState(null);
  const [original, setOriginal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!registration_number) {
      alert('No registration number provided');
      navigate('/student-management');
      return;
    }

    fetch(`${url_base}/api/get_particular_student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_number }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setOriginal(data);
      })
      .catch(() => alert('Failed to load student details'));
  }, [registration_number, navigate]);

  const handleChange = (key, value) => {
    setStudent({ ...student, [key]: value });
  };

  const handleSave = async () => {
    const res = await fetch(`${url_base}/api/update_student_record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_number, ...student }),
    });
    const data = await res.json();
    alert(data.message || 'Student updated');
    navigate('/student-management');
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this student?');
    if (!confirm) return;

    await fetch(`${url_base}/api/delete_student_record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_number }),
    });

    alert('Student deleted successfully');
    navigate('/student-management');
  };

  if (!student) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="container py-4 text-white bg-dark min-vh-100">
      <h4 className="text-danger mb-3">Edit Student: {student.name}</h4>

      {Object.entries(student).map(([key, value]) => (
        key !== '_id' && (
          <div className="mb-3" key={key}>
            <label className="form-label text-capitalize">{key.replaceAll('_', ' ')}</label>
            <input
              type="text"
              className="form-control"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        )
      ))}

      <div className="d-flex gap-2 mt-4">
        <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
        <button className="btn btn-warning" onClick={() => setStudent(original)}>Discard Changes</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete Student</button>
      </div>
    </div>
  );
};

export default StudentEdit;
