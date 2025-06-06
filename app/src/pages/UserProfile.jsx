import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';
import { Pencil } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingFields, setEditingFields] = useState({});

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`${url_base}/api/user_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: userId }),
      });

      const data = await res.json();
      if (data.user_details) {
        setOriginalData(data.user_details);
        setFormData(data.user_details);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEdit = (field) => {
    setEditingFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'year' ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    const updatedFields = {};
    for (const field in editingFields) {
      if (editingFields[field]) {
        updatedFields[field] = formData[field];
      }
    }

    try {
      const res = await fetch(`${url_base}/api/update_student_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_number: userId,
          ...updatedFields,
        }),
      });

      if (res.ok) {
        alert('Changes saved successfully');
        fetchUserDetails();
        setEditingFields({});
      } else {
        alert('Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  const handleDiscard = () => {
    setFormData(originalData);
    setEditingFields({});
  };

  const handleChangePassword = () => {
    alert('Change password functionality coming soon!');
  };

  if (!formData) return <div className="text-center mt-5 text-white">Loading...</div>;

  const renderField = (label, field, editable = false) => (
    <div className="mb-3">
      <label className="form-label text-white fw-bold">{label}</label>
      <div className="d-flex align-items-center">
        {editable && editingFields[field] ? (
          <input
            className="form-control"
            value={formData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ) : (
          <input
            className="form-control"
            value={formData[field] || ''}
            readOnly
          />
        )}
        {editable && !editingFields[field] && (
          <button
            className="btn btn-sm btn-outline-light ms-2"
            onClick={() => handleEdit(field)}
          >
            <Pencil size={16} />
          </button>
        )}
      </div>
    </div>
  );

  const renderArrayField = (label, field) => (
    <div className="mb-3">
      <label className="form-label text-white fw-bold">{label}</label>
      <div className="bg-light text-dark rounded p-2">
        {Array.isArray(formData[field]) && formData[field].length > 0 ? (
          formData[field].map((item, index) => (
            <div key={index}>
              {typeof item === 'object'
                ? Object.values(item).join(' - ')
                : item.toString()}
            </div>
          ))
        ) : (
          <div className="text-muted">None</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4 text-white">
      <h3 className="text-danger text-center mb-4">User Profile</h3>
      <div className="bg-dark p-4 rounded shadow">

        {renderField('Name', 'name')}
        {renderField('Registration Number', 'registration_number')}
        {renderField('YRC ID', 'yrc_id')}
        {renderField('Email ID', 'email')}
        {renderField('Designation', 'designation')}
        {renderField('Mobile Number', 'mobile_number', true)}
        {renderField('Secondary Mobile Number', 'secondary_mobile_number', true)}
        {renderField('Year', 'year', true)}
        {renderField('Department', 'department', true)}
        {renderField('Section', 'section', true)}
        {renderField('Blood Group', 'blood_group', true)}
        {renderField('Mode of Transport', 'mode_of_transport', true)}
        {renderField('Address', 'address', true)}
        {renderField('Date of Birth', 'date_of_birth')}
        {renderField('Events Attended', 'events_attended')}
        {renderArrayField('Allocated Groups', 'allocated_groups')}
        {renderArrayField('Event Groups', 'event_groups')}

        <div className="my-4 text-center">
          <button className="btn btn-danger" onClick={handleChangePassword}>Change Password</button>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" onClick={handleDiscard}>Discard Changes</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
