import { useEffect, useState } from 'react';
import { url_base } from '../config';

const AddMembers = () => {
  const [username, setUsername] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');
    fetchMembers({});
  }, []);

  const fetchMembers = async (filterPayload) => {
    try {
      const res = await fetch(`${url_base}/api/fetch_members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.keys(filterPayload).length ? filterPayload : null),
      });
      const result = await res.json();
      setMembers(result.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleCheckbox = (yrc_id) => {
    setSelectedIds((prev) =>
      prev.includes(yrc_id) ? prev.filter(id => id !== yrc_id) : [...prev, yrc_id]
    );
  };

  const applyFilter = () => {
    const cleanedFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== undefined &&
        value !== null &&
        !(typeof value === 'number' && isNaN(value))
      ) {
        cleanedFilters[key] = value;
      }
    });
  
    console.log("🧪 Sending filters:", cleanedFilters); // Debug log
    fetchMembers(Object.keys(cleanedFilters).length ? cleanedFilters : {});
  };

  const addMembers = async () => {
    const event_id = sessionStorage.getItem('eventId');
    if (!event_id || selectedIds.length === 0) return alert('No members selected');

    try {
      const res = await fetch(`${url_base}/api/add_members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yrc_members_id: selectedIds, event_id }),
      });

      if (res.ok) {
        alert('Members added successfully!');
        window.location.href = '/events';
      } else {
        alert('Failed to add members');
      }
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  return (
    <div className="vh-100 bg-dark text-white p-3 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger fw-bold">Cross<span className="text-white">Link</span></h4>
        <span className="fw-semibold">{username}</span>
      </div>

      <h5 className="text-white mb-4 text-center">Add Members</h5>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <input className="form-control" placeholder="Name" onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <select
          className="form-select"
          onChange={e => {
            const val = e.target.value;
            setFilters({ ...filters, year: val === '' ? '' : parseInt(val) });
          }}
        >
          <option value="">All Years</option>
          <option value="1">1</option><option value="2">2</option><option value="3">3</option>
        </select>
        <select className="form-select" onChange={e => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
          {["AIDS", "CSE", "ECE", "EEE", "MECH", "CIVIL", "AUTO", "IT"].map(dept =>
            <option key={dept} value={dept}>{dept}</option>
          )}
        </select>
        <select className="form-select" onChange={e => setFilters({ ...filters, section: e.target.value })}>
          <option value="">All Sections</option>
          <option value="A">A</option><option value="B">B</option>
          <option value="C">C</option><option value="D">D</option>
        </select>
        <button className="btn btn-outline-light" onClick={applyFilter}>Apply Filter</button>
      </div>

      {/* Member List */}
      <div className="flex-grow-1 overflow-auto">
        {members.length === 0 ? (
          <div className="text-center text-muted mt-4">No members found</div>
        ) : (
          members.map((member) => (
            <div key={member.yrc_id} className="d-flex align-items-center justify-content-between bg-secondary p-2 rounded mb-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedIds.includes(member.yrc_id)}
                  onChange={() => handleCheckbox(member.yrc_id)}
                />
              </div>
              <div className="flex-grow-1 ms-2">
                <p className="mb-1 fw-bold">{member.name}</p>
                <small className="text-light">
                  {member.year} Year &middot; {member.department} &middot; Sec {member.section}
                </small>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Add Members Button */}
      <button
        className="btn btn-success rounded-pill position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        onClick={addMembers}
      >
        Add Members
      </button>
    </div>
  );
};

export default AddMembers;
